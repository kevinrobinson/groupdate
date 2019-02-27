import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import qs from 'query-string';
import './ImageSearch.css';

export default class ImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      json: null,
      predictionsMap: {}
    };

    this.imgEls = {};
    this.onFetchDone = this.onFetchDone.bind(this);
    this.onFetchError = this.onFetchError.bind(this);
    this.debouncedFetch = _.debounce(this.debouncedFetch, 100);
  }

  componentDidMount() {
    console.log('componentDidMount', this.props);
    this.debouncedFetch();
  }

  componentWillUnmount(){
    this.imgEls = undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.query !== prevProps.query) {
      this.debouncedFetch();
    }

    if (!_.isEqual(this.state.json, prevState.json)) {
      this.updatePredictions();
    }
  }

  apiKey() {
    return this.props.apiKey || readApiKeyFromWindow();
  }

  async updatePredictions() {
    const {asyncPredictFn} = this.props;
    if (!asyncPredictFn) {
      console.log('no asyncPredictFn...');
      return;
    }

    const items = (this.state.json && this.state.json.items) || [];
    const predictions = await Promise.all(items.map(item => {
      const imgEl = this.imgEls[item.link];
      return asyncPredictFn(imgEl);
    }));
    var predictionsMap = {};
    items.forEach((item, index) => predictionsMap[item.link] = predictions[index]);
    console.log('predictionsMap', JSON.stringify(predictionsMap, null, 2));
    this.setState({predictionsMap});
  }

  debouncedFetch() {
    const {domain, query} = this.props;
    const headers = {'X-Services-Edu-Api-Key': this.apiKey()};
    const url = `${domain || readDomainFromEnv()}/images/search?q=${query}`;
    fetch(url, {headers})
      .then(response => response.json())
      .then(this.onFetchDone)
      .catch(this.onFetchError);
  }

  onFetchDone(json) {
    this.setState({json});
  }

  onFetchError(error) {
    this.setState({error});
  }

  render() {
    return (
      <div className="ImageSearch">
        <header className="ImageSearch-header">
          {!this.apiKey() ? this.renderMissingApiKey() : this.renderSearch()}
        </header>
      </div>
    );
  }

  renderMissingApiKey() {
    return (
      <div>
        <div>You need an API key to get started.</div>
        <div>When you get one, add it to the URL like `/images?api_key=abc`</div>
      </div>
    );
  }

  renderSearch() {
    const {error, json} = this.state;
    return (
      <div>
        {json && this.renderJson(json.items || [])}
        {error && <div>error: {JSON.stringify(error, null, 2)}</div>}
      </div>
    );
  }

  renderJson(items) {
    const {imageProps} = this.props;
    const {predictionsMap} = this.state;
    return (
      <div>
        {items.map(item => (
          <div className="ImageSearch-image" key={item.link}>
            <img
              ref={el => this.imgEls[item.link] = el}
              src={item.image.thumbnailLink}
              alt={item.title}
              {...imageProps}
            />
            <div className="ImageSearch-image-source">
              <span>from </span>
              <a className="ImageSearch-image-link" href={item.image.contextLink} target="_blank" rel="noopener noreferrer">{item.displayLink}</a>
            </div>
            <div>
              <span>prediction: </span>
              {(predictionsMap || {})[item.link]}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
ImageSearch.propTypes = {
  query: PropTypes.string.isRequired,
  asyncPredictFn: PropTypes.func.isRequired,
  imageProps: PropTypes.object,
  domain: PropTypes.string,
  apiKey: PropTypes.string
};

export function readApiKeyFromWindow() {
  const queryString = qs.parse(window.location.search);
  return queryString.api_key;
}


function readDomainFromEnv() {
  return window.process.env.REACT_APP_DOMAIN || 'http://localhost:5000';
}