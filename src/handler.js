const { nanoid } = require('nanoid')
const { funcFilteringProperty } = require('./helper-filtering')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const isNameNull = name == null
  const readPageHigherpageCount = readPage > pageCount

  if (isNameNull) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPageHigherpageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { reading } = request.query
  const { finished } = request.query
  const { name } = request.query

  if (reading !== undefined) {
    const FilterReading = reading == 1
    const FilterBook = books.filter((b) => b.reading === FilterReading)
    return h.response({
      status: 'success',
      data: {
        books: funcFilteringProperty(FilterBook)
      }
    }).code(200)
  }

  if (finished !== undefined) {
    const FilterFinished = finished == 1
    const FilterBook = books.filter((b) => b.finished === FilterFinished)
    return h.response({
      status: 'success',
      data: {
        books: funcFilteringProperty(FilterBook)
      }
    }).code(200)
  }

  if (name !== undefined) {
    const FilterBook = books.filter((b) => b.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)
    return h.response({
      status: 'success',
      data: {
        books: funcFilteringProperty(FilterBook)
      }
    }).code(200)
  }

  const dataBook = funcFilteringProperty(books)

  return h.response({
    status: 'success',
    data: {
      books: dataBook
    }
  }).code(200)
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((b) => b.id === id)[0]

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const isNameNull = name == null
  const readPageHigherpageCount = readPage > pageCount

  if (isNameNull) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPageHigherpageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
