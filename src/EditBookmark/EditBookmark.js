import React, { Component } from  'react';
import PropTypes from 'prop-types';
import config from '../config'

import BookmarksContext from '../BookmarksContext';
import { Link } from 'react-router-dom';

import './EditBookmark.css';

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static contextType = BookmarksContext;

	state = {
    id: '',
    title: 'Title',
    url: '',
    description: 'Description',
    rating: 5,
		error: null
	}

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmark_id;
    
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(res => {
        this.setState({
            id: res.id,
            title: res.title,
            url: res.url,
            description: res.description,
            rating: res.rating
        })
      })
      .catch(error => {
        console.error(error);
        this.setState({ error })
        }
      )
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const bookmarkId = this.props.match.params.bookmark_id
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }

    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  render() {
    console.log(this.state);
    const { error, title, url, description, rating } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input
            type='hidden'
            name='id'
          />
          <div>
            <label htmlFor='title'>
              Title
              {' '}
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={url}
              onChange={this.handleChangeUrl}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={this.handleChangeRating}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <Link to='/'>
              Cancel
            </Link>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;