function parse() {
  const dateOptions = {
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  fetch("https://api.apify.com/v2/datasets/QnpvWy7yH1w0PAMkS/items?format=json&clean=1")
    .then(response => {
      if (response.status !== 200)
        throw new Error("Not 200 response")
      return response.json()
    })
    .then(data => data[0])
    .catch(err => {
      console.error(err)
      return null
    }).then(data => {
    data.posts.map((post) => {
      let counter = 0
      return $(".parser__handler").append(`<div class="parser__handler-item">` +
        `<div class="parser__handler-item__date">` + new Date(post.postDate).toLocaleDateString('uk-UA', dateOptions) + `</div>` +
        `<div class="parser__handler-item__stats">` +
        `<div class="parser__handler-item__stats-reactions">` + `reactions: ` + post.postStats.reactions + `</div>` +
        `<div class="parser__handler-item__stats-comments">` + `comments: ` + post.postStats.comments + `</div>` +
        `<div class="parser__handler-item__stats-shares">` + `shares: ` + post.postStats.shares + `</div>` +
        `</div>` +
        `<div class="parser__handler-item__words">` +
        `<div class="parser__handler-item__words-match">` + `США: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).includes('США') || JSON.stringify(comment.text).includes('Сша') || JSON.stringify(comment.text).includes('сша')) {
            counter++
          }
        }).join('') +
        `</div>` +
        `</div>` +
        `</div>`)
    })
  })
}

parse()
