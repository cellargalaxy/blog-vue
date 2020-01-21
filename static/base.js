window.onload = () => {
  bashWindowOnload()
  try {
    if (staticWindowOnload && typeof (staticWindowOnload) == "function") {
      staticWindowOnload()
    }
  } catch (e) {
    console.log('staticWindowOnload function does not exist')
  }
}

function bashWindowOnload() {
  tableClass()
  codeRow()
}

function tableClass() {
  document.querySelectorAll('table').forEach((table) => {
    table.classList.add('table', 'b-table', 'table-striped', 'table-hover', 'table-responsive')
  })
}

function codeRow() {
  document.querySelectorAll('code').forEach((code) => {
    code.innerHTML = "<ol><li>" + code.innerHTML.replace(/\n/g, "\n</li><li>") + "\n</li></ol>"
  })
}