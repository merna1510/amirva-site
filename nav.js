// Navbar: expanding search field
(function () {
  var sForm = document.querySelector('.nav-search');
  if (!sForm) return;
  var sInput = sForm.querySelector('input');
  sForm.querySelector('.search-toggle').addEventListener('click', function () {
    if (sForm.classList.contains('open') && sInput.value.trim()) { sForm.submit(); return; }
    sForm.classList.toggle('open');
    if (sForm.classList.contains('open')) sInput.focus();
  });
  sInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') sForm.classList.remove('open');
  });
})();
