const express = require('express')
const Book = require('../models/book')
const path = require('path')
const Author = require('../models/author')
const multer = require('multer')
const fs = require('fs')
const router = express.Router()

const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Book Route
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({})
    res.render('books/', {
      books: books,
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('')
  }

})
// New Book Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})
// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    cover: fileName,
  })
  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch (e) {
    if (book.cover != null) removeBookCover(book.cover)
    renderNewPage(res, book, true)
  }
})
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = { authors: authors, book: book }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch (e) {
    res.redirect('/books')
  }
}
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => err && console.error(err))
}
module.exports = router