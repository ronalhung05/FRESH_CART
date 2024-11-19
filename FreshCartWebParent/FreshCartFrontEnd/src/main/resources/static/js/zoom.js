function zoom(event) {
    let target = event.currentTarget;
    let rect = target.getBoundingClientRect();
    let x = (event.clientX - rect.left) / rect.width * 100;
    let y = (event.clientY - rect.top) / rect.height * 100;
    target.style.backgroundPosition = `${x}% ${y}%`;
}
