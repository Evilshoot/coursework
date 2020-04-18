function parse() {
  const dateOptions = {
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  fetch("/dataset_my-task-2.json")
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
      let counter2 = 0
      let counter3 = 0
      let counter4 = 0
      let counter5 = 0
      let counter6 = 0
      let counter7 = 0
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
          if (JSON.stringify(comment.text).toLowerCase().includes('сша')) {
            counter++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Пентагон: `
        + post.postComments.comments.map((comment, i) => {

          if (JSON.stringify(comment.text).toLowerCase().includes('пентагон')) {
            counter2++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter2
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Коронавірус: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).toLowerCase().includes('коронавірус') || JSON.stringify(comment.text).toLowerCase().includes('коронавирус')) {
            counter3++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter3
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Росія: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).toLowerCase().includes('росія') || JSON.stringify(comment.text).toLowerCase().includes('россия')) {
            counter4++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter4
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Криза: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).toLowerCase().includes('криза') || JSON.stringify(comment.text).toLowerCase().includes('кризис')) {
            counter5++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter5
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Карантин: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).toLowerCase().includes('карантин') || JSON.stringify(comment.text).toLowerCase().includes('карантин')) {
            counter6++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter6
          }
        }).join('') +
        `</div>` +
        `<div class="parser__handler-item__words-match">` + `Вірус: `
        + post.postComments.comments.map((comment, i) => {
          if (JSON.stringify(comment.text).toLowerCase().includes('вірус') || JSON.stringify(comment.text).toLowerCase().includes('вирус')) {
            counter7++
          }
          if(post.postComments.comments.length - 1 === i){
            return counter7
          }
        }).join('') +
        `</div>` +
        `</div>` +
        `</div>`)
    })
  })
}

parse()
