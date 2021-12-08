// create state and server
// render based on state
// update state and server
// rerender

//Global Variables to get accesed everywhere in the app
const sectionPostEl = document.querySelector('section.image-container')
const formPostEl = document.querySelector('form.post-form-el')


//------------------------------------------------STATE OBJECT---------------------------------------------------

const state = {
    images: []
}

//----------------------------------------------END OF STATE OBJECT--------------------------------------------------------


//-----------------------------------------------SERVER FUNCTIONS---------------------------------------------------------------------

// getImagesDataFromServer :: () => Promise<todos: array> this function gets all images array stores in the state
function getImagesDataFromServer() {

    return fetch('http://localhost:3000/images').then(function (response) 
    {
        return response.json()
    })

}

//this function adds each individual comment when you click small btn to the server
function createCommentToServer(commentsParam) {

        return fetch('http://localhost:3000/comments', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(commentsParam)

        }).then(function (resp) {
            return resp.json()
        })

}

//this function adds every item from the form when i create to the server update
function createPostToServer(imagesObjectParam) {

    return fetch('http://localhost:3000/images', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(imagesObjectParam)

    }).then(function(resp) {
        return resp.json()
    })

}

//this function deletes item from the server wich is user inputed from the x button on the page
function deletePostFromServer(imageIdParam) {

    return fetch(`http://localhost:3000/images/${imageIdParam}`, {

        method: 'DELETE'

    }).then(function(resp) {
        return resp.json()
    })

}

//this function deletes comments from the server wich is user inputed from the x button on the page
function deleteCommentFromServer(imageCommentIdParam) {

    fetch(`http://localhost:3000/comments/${imageCommentIdParam}`, {
        method: 'DELETE'
    }).then(function(resp) {
        return resp.json()
    })

}

//----------------------------------------------END OF SERVER FUNCTIONS------------------------------------------------------------------


//----------------------------------------------HELPER FUNCTIONS---------------------------------------------------------------------------

//this function add coments from clicking the small btn in the post and ads it to the state then rerenders
function createCommentToState(formObjectParam, commentParam) { //removed formparam

    let addComment = {
        content: commentParam,
        imageId: formObjectParam.id
    }

    createCommentToServer(addComment).then(function(comment) {
        formObjectParam.comments.push(comment)
        // state.comments.push(comment)
        render()
    })

}

//this function is called with arguemnts when the btn click heart to do the up and down the likes state property
function increaseLikeToState(likesParamFromArray) {
    likesParamFromArray.likes += 1
}

//this function listen event when i submit the form with ading a new post to the page
function listenToFormSubmitNewPost() {
    
    formPostEl.addEventListener('submit', function(event) {

        event.preventDefault()

        const inputObject = {
           title: formPostEl.title.value,
           likes: parseInt(formPostEl.likes.value),
           image: formPostEl.image.value
        }

        //very crucial, we get things from server then we render, .then promise etc
        createPostToServer(inputObject).then(function(image) { //here we dont use addPostToForm so this works better in this case

            state.images.push(image)
            image.comments = [] //empty array so that is auto created when each post is created and rendered

            render() //rerender the page

        })

    })

}

//-----------------------------------------END OF HELPER FUNCTIONS---------------------------------------------------------


//--------------------------------------------RENDER FUNCTIONS--------------------------------------------------

//this function renders post, wich itself calls rendePostItem in a for loop to get all from the state, destroy then recreate
function renderPosts(ImagesArrayParam) {

    //we destroy everything then recreate each time it renders the page and state changes
    sectionPostEl.innerHTML = ''

    //recreate using the array to create individual render each post basech on each object inside the array

    for (const image of ImagesArrayParam) {
        renderPostItem(image)
    }

}

//this function renders individually each post item, with DOM and Events manipulation
function renderPostItem(imagesObjectParam) {

    //we create the post card by js from template
    const articleEl = document.createElement('article')
    articleEl.setAttribute('class', 'image-card')

    const h2El = document.createElement('h2')
    h2El.setAttribute('class', 'title')
    h2El.textContent = imagesObjectParam.title

    const removePostBtnEl = document.createElement('button')
    removePostBtnEl.setAttribute('class', 'remove-btn-post')
    removePostBtnEl.textContent = 'X'

    const imgEl = document.createElement('img')
    imgEl.setAttribute('class', 'image')
    imgEl.setAttribute('src', imagesObjectParam.image)

    const divEl = document.createElement('div')
    divEl.setAttribute('class', 'likes-section')

    const spanEl = document.createElement('span')
    spanEl.setAttribute('class', 'likes')
    spanEl.textContent = imagesObjectParam.likes

    const btnEl = document.createElement('button')
    btnEl.setAttribute('class', 'like-button')
    btnEl.textContent = '♥'

    const formEl = document.createElement('form')
    formEl.setAttribute('class', 'comment-form')

    const inputEl = document.createElement('input')
    inputEl.setAttribute('class', 'comment-input')
    inputEl.setAttribute('name', 'comment')
    inputEl.setAttribute('required', 'true')
    inputEl.setAttribute('type', 'text')
    inputEl.placeholder = 'Add a comment ....'

    const btnFormEl = document.createElement('button')
    btnFormEl.setAttribute('class', 'comment-button')
    btnFormEl.textContent = 'Post'

    const ulEl = document.createElement('ul')
    ulEl.setAttribute('class', 'comments-ul-form')

    //for of loop just to create each comment in LI DOM also X button, and to add event listener here, if i added outside things broke
    for (const comment of imagesObjectParam.comments) {

        const liEl = document.createElement('li')
        liEl.textContent = comment.content

        let removeCommentBtnEl = document.createElement('button')
        removeCommentBtnEl.setAttribute('class', 'remove-comment-btn-post')
        removeCommentBtnEl.textContent = 'x'

        // event listener for remove comment from post
        removeCommentBtnEl.addEventListener('click', function(event) {

            event.preventDefault()

            //we delete it from server
            deleteCommentFromServer(comment.id)

            // delete comment on state
            imagesObjectParam.comments = imagesObjectParam.comments.filter(function (targetComment) {
                return targetComment.id !== comment.id
            })
        
            //rerender the page
            render()
        })

        ulEl.append(liEl, removeCommentBtnEl)

    }

    //appending things
    formEl.append(inputEl, btnFormEl)
    divEl.append(spanEl, btnEl)
    articleEl.append(h2El, removePostBtnEl ,imgEl, divEl, ulEl, formEl)
    sectionPostEl.append(articleEl)

    //val wich is neeeded to catch the input value for comment adding
    let inputValue

    //events listeners for FORM SUBMIT IN THE COMMENT adding
    formEl.addEventListener('submit', function(event) {
        event.preventDefault()

        inputValue = formEl.comment.value
        createCommentToState(imagesObjectParam, inputValue)
    })

    //event listener for like button, increasing etc like in social media
    btnEl.addEventListener('click', function(event) {
        event.preventDefault()

        increaseLikeToState(imagesObjectParam)
        render()
    })

    //event listener for remove Item from post 
    removePostBtnEl.addEventListener('click', function(event) {
        event.preventDefault()

        //deletes post form server
        deletePostFromServer(imagesObjectParam.id)

        //deletes post from state
        state.images = state.images.filter(image => image.id !== imagesObjectParam.id)

        // rerender
        render()
    })

}

//the main function calls everything and makes state and rerendering works
function render() {
    console.log('rendering with state:', state)
    renderPosts(state.images) //here we pass the array images 
}

//this main function groups everything to load the app
function init() {

    render()

    //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
    getImagesDataFromServer().then(function (imagesArrayFromServer) {
        state.images = imagesArrayFromServer
        render()
    })

    listenToFormSubmitNewPost()

}
//-------------------------------------------END OF RENDER FUNCTIONS------------------------------------------------------


//------------------------------------------------CALLING INIT------------------------------------------------------------------

init()