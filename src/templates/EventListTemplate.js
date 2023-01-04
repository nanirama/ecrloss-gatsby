import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import Seo from '../components/Seo';
import {EventIndex} from '../components/Event';
import Pagination from '../components/Pagination';

const EventListTemplate = ({data, pageContext, path, location}) => {
    const {
        allPrismicEvent: {edges: eventsData},
    } = data;

    const {basePath, paginationPath, categories, sortedEvents, limit, humanPageNumber } = pageContext;

    const firsEl = (humanPageNumber -1) * limit;
    const secondEl = firsEl + limit;

    const slicedArr = sortedEvents.slice(firsEl, secondEl).map(event => event.node);
    const events = eventsData.map((event) => event.node);

    const futurenormalizedCats = categories.map((cat) => ({
        path: `${basePath}/future/${cat.uid}`,
        name: cat.document.data.name,
        color: cat.document.data.color,
    }));
    const pastnormalizedCats = categories.map((cat) => ({
        path: `${basePath}/past/${cat.uid}`,
        name: cat.document.data.name,
        color: cat.document.data.color,
    }));
    const categoriesList = [
        {name: 'Everything', path: basePath},
        {name: 'Past Events', path: basePath + '/past/', subCats: pastnormalizedCats},
        {name: 'Future Events', path: basePath + '/future/', subCats: futurenormalizedCats}
    ];

    if (!slicedArr) return null;

    return (
        <Layout location={location}>
            <Seo pathname={location.pathname} title="Events"/>
            <EventIndex events={slicedArr} basePath={basePath} path={paginationPath}
                        categories={categoriesList}/>
            <Pagination data={pageContext}/>
        </Layout>
    );
};

EventListTemplate.propTypes = {
    data: PropTypes.object.isRequired,
};

export default EventListTemplate;

export const data = graphql`
  query($skip: Int!, $limit: Int!) {
    allPrismicEvent(
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          id
          uid
          data {
            title {
              text
            }
            description
            start_date
            end_date
            custom_date
            organiser
            city
            register_label
            register_url {
              url
              uid
              type
              target
            }
            category {
              uid
              document {
                ... on PrismicCategory {
                  data {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
