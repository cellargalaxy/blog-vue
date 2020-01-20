window.onload = () => {
  document.querySelectorAll('table').forEach((table) => {
    table.classList.add('table', 'b-table', 'table-striped', 'table-hover', 'table-responsive')
  })
  try {
    if (customizeWindowOnload && typeof (customizeWindowOnload) == "function") {
      customizeWindowOnload()
    }
  } catch (e) {
    console.log('customizeWindowOnload function does not exist')
  }
}