document.addEventListener('click', function(){
    alert(browser.runtime.openOptionsPage);
    console.log('browser', browser);
    browser.runtime.openOptionsPage();
});