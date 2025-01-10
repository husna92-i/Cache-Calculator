
const particlesContainer = document.querySelector('.particles');
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';

    particlesContainer.appendChild(particle);
}

document.getElementById('mappingType').addEventListener('change', function () {
    const associativityGroup = document.getElementById('associativityGroup');
    associativityGroup.style.display = this.value === 'set' ? 'block' : 'none';
});

document.getElementById('associativityGroup').style.display =
    document.getElementById('mappingType').value === 'set' ? 'block' : 'none';
