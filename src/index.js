//Global Variables to get accesed everywhere in the app
const sectionPostEl = document.querySelector('section.image-container')


//--------------------------------------STATE OBJECT---------------------------------------------------

const state = {

    images: [],
    comments: []

}

//----------------------------------------END OF STATE OBJECT--------------------------------------------------------


//--------------------------------SERVER FUNCTIONS---------------------------------------------------------------------

// getImagesDataFromServer :: () => Promise<todos: array> this function gets all images array stores in the state
function getImagesDataFromServer() {

    return fetch('http://localhost:3000/images').then(function (response) 
    {
        return response.json()
    })

}

//getCommentsDataFromServer :: () => Promise<todos: array> this function gets all comments array stores it in the state
function getCommentsDataFromServer() {

    return fetch('http://localhost:3000/comments').then(function (response) 
    {
        return response.json()
    })

}

//this function adds each individual comment when you click small btn to the server
function addCommentCreateToServer(commentsParam) {

    // for (const element of commentsArrayParam) {

        return fetch('http://localhost:3000/comments', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(commentsParam)

        }).then(function (resp) {
            return resp.json()
        })



    // }

}

//this function adds every item from the form when i create to the server update
function addItemFromFormToServer(imagesObjectParam) {

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
function removeItemFromServer(itemParam) {

    fetch(`http://localhost:3000/images/${itemParam.id}`, {

        method: 'DELETE'

    })

}

//this function deletes comments from the server wich is user inputed from the x button on the page
function removeCommentFromServer(itemParam, commentParam) {

    fetch(`http://localhost:3000/comments/${itemParam.id}`, {

        method: 'DELETE'

    })

}

//---------------------------------END OF SERVER FUNCTIONS------------------------------------------------------------------


//---------------------------------HELPER FUNCTIONS---------------------------------------------------------------------------

//this function add coments from clicking the small btn in the post and ads it to the state then rerenders
function addCommentFromForm(formParam, formValueParam) { //removed formparam

    let objectCommentsAdd = {
        // id: state.comments.length + 1,
        content: formValueParam,
        imageId: formParam.id
    }

    // let objectForm = {
    //     id: formParam.id,
    //     title: formParam.title,
    //     likes: formParam.likes,
    //     image: formParam.image,
    //     comments: [
    //         objectCommentsAdd
    //     ]

    // }


    addCommentCreateToServer(objectCommentsAdd).then(function(comment) {

        formParam.comments.push(comment)
        state.comments.push(comment)  //remove one
        render()

    }) //this calls the function to update the server


}

//this function add item form form in the page from clicking  the form submit in the page and ads it to the state then rerenders
// function addItemFromFormToState(inputParam1, inputParam2, inputParam3, inputParam4) { //these 4 params are passed form renderForm when an form btn is sumbited and i use those values here


//     let objectItemImages = {
//         title: inputParam1,
//         likes: inputParam2,
//         image: inputParam4,
//     }

//     //variable pushed wich is the user form input new item


//     //rendering after updating state, and updating server then rerender always

// }

//this function is called with arguemnts when the btn click heart to do the up and down the likes state property
function addLikeFromInput(likesParamFromArray) {

    likesParamFromArray.likes += 1

}

//this function is called with arguments when the btn x is clicked to remove the post from item in renderPostItem function
function removeItemFromPost(arrayParam) {

    //update the server by removing this entry
    removeItemFromServer(arrayParam)

    //update the state
    delete arrayParam.id, arrayParam.title, delete arrayParam.likes, delete arrayParam.comments
    delete state.comments[arrayParam.id - 1]
    
    //update the server by removing this entry
    // removeItemFromServer(arrayParam)

    //rerender the page
    render()

} 

//this function is called with arguments when the btn x is clicked to remove the comment from post  in renderPostItem function
function removeCommentFromPost(arrayParam) {

    //update the server by removing this entry
    removeCommentFromServer(arrayParam)

    //update the state
    delete arrayParam.comments[0]
    // delete state.comments[arrayParam.id - 1]
    
    //update the server by removing this entry
    // removeItemFromServer(arrayParam)

    //rerender the page
    render()

}

//this function filters id to remove comment in state as a helper function
function getFilteredIdComments() {

    state.images = images.comments.filter(comment => comment.id !== id)

}

//---------------------------------END OF HELPER FUNCTIONS---------------------------------------------------------


//---------------------------------RENDER FUNCTIONS--------------------------------------------------

//this function renders post, wich itself calls rendePostItem in a for loop to get all from the state, destroy then recreate
function renderPost(ImagesParam) {

    //we destroy everything then recreate each time it renders the page and state changes
    sectionPostEl.innerHTML = ''
    renderForm()

    //recreate
    for (const element of ImagesParam) {
        renderPostItem(element)
    }

}

//this function renders individually each post item, with DOM and Events manipulation
function renderPostItem(postParam) {

    //we create the post card by js from template
    const articleEl = document.createElement('article')
    articleEl.setAttribute('class', 'image-card')

    const h2El = document.createElement('h2')
    h2El.setAttribute('class', 'title')
    h2El.textContent = postParam.title

    const removeBtnEl = document.createElement('button')
    removeBtnEl.setAttribute('class', 'remove-btn-post')
    removeBtnEl.textContent = 'X'

    const imgEl = document.createElement('img')
    imgEl.setAttribute('class', 'image')
    imgEl.setAttribute('src', postParam.image)

    const divEl = document.createElement('div')
    divEl.setAttribute('class', 'likes-section')

    const spanEl = document.createElement('span')
    spanEl.setAttribute('class', 'likes')
    spanEl.textContent = postParam.likes

    const btnEl = document.createElement('button')
    btnEl.setAttribute('class', 'like-button')
    btnEl.textContent = '♥'

    const formEl = document.createElement('form')
    formEl.setAttribute('class', 'form-section')

    const inputEl = document.createElement('input')
    inputEl.setAttribute('class', 'input-element')
    inputEl.setAttribute('name', 'comment')
    inputEl.setAttribute('required', 'true')
    inputEl.setAttribute('type', 'text')
    inputEl.placeholder = 'Add a comment ....'

    const btnFormEl = document.createElement('button')
    btnFormEl.setAttribute('class', 'btn-element')
    btnFormEl.textContent = 'Post'

    // const removeCommentBtnEl = document.createElement('button')
    // removeCommentBtnEl.setAttribute('class', 'remove-comment-btn-post')
    // removeCommentBtnEl.textContent = 'x'

    const ulEl = document.createElement('ul')
    ulEl.setAttribute('class', 'comments')


    //this fixed problem for comment creating dynamic li creation
    for (const comment of postParam.comments) {

        if (comment.id === undefined) { //this somehow worked if an element is removed just go to the else
            continue
        } //move addevent listener isnide the loop

        //for all that are not removed yet and stay in page
        else {

            const liEl = document.createElement('li')
            liEl.textContent = comment.content

            let removeCommentBtnEl = document.createElement('button')
            removeCommentBtnEl.setAttribute('class', 'remove-comment-btn-post')
            removeCommentBtnEl.textContent = 'x'

            // event listener for remove comment from post
            removeCommentBtnEl.addEventListener('click', function(event) {

                event.preventDefault()
                removeCommentFromPost(postParam)
        
            })

            ulEl.append(liEl, removeCommentBtnEl)

        }

    }

    //appending things
    formEl.append(inputEl, btnFormEl)
    divEl.append(spanEl, btnEl)
    articleEl.append(h2El, removeBtnEl ,imgEl, divEl, ulEl, formEl)
    sectionPostEl.append(articleEl)

    let inputValue

    //events listeners
    formEl.addEventListener('submit', function(event) {

        event.preventDefault()

        inputValue = formEl.comment.value
        addCommentFromForm(postParam, inputValue)
        
    })

    //event listener for like button
    btnEl.addEventListener('click', function(event) {

        event.preventDefault()
        addLikeFromInput(postParam)

        render()

    })

    //event listener for remove Item from post
    removeBtnEl.addEventListener('click', function(event) {

        event.preventDefault()
        removeItemFromPost(postParam)

    })

    // // event listener for remove comment from post
    // removeCommentBtnEl.addEventListener('click', function(event) {

    //     event.preventDefault()
    //     removeCommentFromPost(postParam)
        
    // })

}

//this function renders the form in the beginning of the page, to add new items wich is user input
function renderForm() {
    
    //create the post header form to add things, update state and server rerender
    const divEl = document.createElement('div')
    divEl.setAttribute('class', 'post-form')

    const h3El = document.createElement('h3')
    h3El.setAttribute('class', 'post-form-header')
    h3El.textContent = 'New Post'

    const formEl = document.createElement('form')
    formEl.setAttribute('class', 'post-form-el')

    const inputEl1 = document.createElement('input')
    inputEl1.setAttribute('class', 'post-form-input input-1')
    inputEl1.setAttribute('name', 'title')
    inputEl1.setAttribute('required', 'true')
    inputEl1.setAttribute('type', 'text')
    inputEl1.placeholder = 'Add a title: '

    const inputEl2 = document.createElement('input')
    inputEl2.setAttribute('class', 'post-form-input input-2')
    inputEl2.setAttribute('name', 'likes')
    inputEl2.setAttribute('required', 'true')
    inputEl2.setAttribute('type', 'text')
    inputEl2.placeholder = 'Add how many likes: '

    const inputEl3 = document.createElement('input')
    inputEl3.setAttribute('class', 'post-form-input input-3')
    inputEl3.setAttribute('name', 'comment')
    inputEl3.setAttribute('required', 'true')
    inputEl3.setAttribute('type', 'text')
    inputEl3.placeholder = 'Add a comment: '

    const inputEl4 = document.createElement('input')
    inputEl4.setAttribute('class', 'post-form-input input-4')
    inputEl4.setAttribute('name', 'image')
    inputEl4.setAttribute('required', 'true')
    inputEl4.setAttribute('type', 'text')
    inputEl4.placeholder = 'Add an image url: '

    const btnEl = document.createElement('button')
    btnEl.setAttribute('class', 'post-form-btn')
    btnEl.textContent = 'Post'

    formEl.append(inputEl1, inputEl2, inputEl3, inputEl4, btnEl)
    divEl.append(h3El, formEl)
    sectionPostEl.append(divEl)

    //values for getting input values from user
    let inputElValue1, inputElValue2, inputElValue3, inputElValue4

    // event listeners
    formEl.addEventListener('submit', function(event) {

        event.preventDefault()

        const inputObject = {
           title: formEl.title.value,
           likes: parseInt(formEl.likes.value),
           image: formEl.image.value
        }

        // inputElValue1 = formEl.title.value
        // inputElValuuee2 = parseInt(formEl.likes.value)
        // inputElValue3 = formEl.comment.value
        // inputElValue4 = formEl.image.val


        addItemFromFormToServer(inputObject).then(function(image) {
            state.images.push(image)
            image.comments = []

            render()
        })

    })

}

//the main function calls everything and makes state and rerendering works
function render() {

    console.log('rendering with state:', state)
    renderPost(state.images)

}

//------------------------------END OF RENDER FUNCTIONS------------------------------------------------------


//FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
getImagesDataFromServer().then(function (imagesFromServer) {
    state.images = imagesFromServer
    render()
})

getCommentsDataFromServer().then(function (commentsFromServer) {
    state.comments = commentsFromServer
    render()
})


//CALLING RENDER
// This happens before the fetch is done and fetch requeires some ms to load the data
render()