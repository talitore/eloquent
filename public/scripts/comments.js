var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = [comment].concat(comments);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} />
      </div>
    );
  }
});
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} timestamp={comment.timestamp}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = e.target.elements.whodunnit.value;
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text, timestamp: new Date()});
    React.findDOMNode(this.refs[author]).checked = false;
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    var authors = [
      {ref: 'Sandi', value: 'Sandi', imageUrl: 'images/sandi.jpg'},
      {ref: 'Cory', value: 'Cory', imageUrl: 'images/cory.jpg'},
      {ref: 'anon', value: 'literally anyone else', imageUrl: 'images/anon.jpg'}
    ];
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <div className='row authors'>
          <div className='large-8 columns large-centered'>
            {authors.map(function(author) {
              return <div className='large-4 columns'>
                <label>
                  <input type='radio' name='whodunnit' ref={author.ref} value={author.ref}/>
                  <img src={author.imageUrl} alt={author.value} className='whodunnit-thumb drop'/>
                </label>
              </div>
            })}
          </div>
        </div>
        <div className='row'>
          <div className='large-8 columns large-centered'>
            <div className='row collapse'>
              <div className='large-10 columns'>
                <input type="text" placeholder="what'd they say?!" ref="text" />
              </div>
              <div className='large-2 columns'>
                <input className='button secondary postfix' type="submit" value="blast it" />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
});
var Comment = React.createClass({
  render: function() {
    return (
      <div className='row authors'>
        <div className='large-8 columns large-centered'>
          <div className="comment">
            <h2 className="commentAuthor">
              {this.props.author}
            </h2>
            <h6 className='subheader'>
              {this.props.timestamp}
            </h6>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});
React.render(
  <CommentBox url="comments.json" pollInterval={2000}/>,
  document.getElementById('content')
);
