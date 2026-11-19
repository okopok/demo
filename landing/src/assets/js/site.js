// Аналитика и форма заявки связаны с целями в Метрике.
// Не менять обработчик без отдельной задачи.
window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.querySelector('#name').value.trim();
    var contact = form.querySelector('#contact').value.trim();
    if (!name || !contact) {
      form.classList.add('was-validated');
      return;
    }

    window.dataLayer.push({ event: 'lead_submit', form: 'contact' });

    var button = form.querySelector('button[type="submit"]');
    button.textContent = 'Заявка отправлена';
    button.disabled = true;
  });
});
