const funcFilteringProperty = (arrayFilter) => {
  const dataBooks = arrayFilter.map(book => {
    const newArray = {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
    return newArray
  })

  return dataBooks
}

module.exports = { funcFilteringProperty }
