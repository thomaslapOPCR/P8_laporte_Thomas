export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}


export function fileValidation(file)  {
  let fileInput = file
  const filePath = fileInput.name
  const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
  const alertForm = document.createElement("div");
  const sendingButtons = document.querySelector('#btn-send-bill');

  alertForm.classList.add("alertFormat")
  alertForm.setAttribute('data-testid', 'alertFormat')
  alertForm.id = 'alertFormat'
  alertForm.innerHTML = 'Uniquement les formats jpeg/jpg/png sont acceptés!'

  if(!allowedExtensions.exec(filePath) || filePath===''){
    fileInput.value = '';
    document.querySelector(`input[data-testid="file"]`).after(alertForm)
    sendingButtons.disabled = true;
    return false;
  }else{
    try {
      document.getElementById('alertFormat').innerHTML = ''//.remove()
      sendingButtons.disabled = false;
    } catch (error) {
      console.log('-')
    }
    return true;
  }
}

export const getByTextRegex = (regex) => {
  const matches = Array.from(document.querySelectorAll('*')).map(el => Array.from(el.childNodes).filter(node => node.nodeType === 3 && node.textContent.match(regex)).map(node => ({
    node,
    text: node.textContent.trim(),
    element: el
  }))).reduce((acc, matches) => [...acc, ...matches], []);

  return matches[0]?.node;
};

