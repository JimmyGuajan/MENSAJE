document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('.letter');
    const dropZones = document.querySelectorAll('.drop-zone');
    const romanticMessage = document.getElementById('romantic-message');
    const targetWord = 'BONITA';
    let currentWord = ['', '', '', '', '', ''];
    let draggedLetter = null;

    // Make letters draggable
    letters.forEach(letter => {
        letter.setAttribute('draggable', 'true');
        
        // Add drag event listeners to letters
        letter.addEventListener('dragstart', (e) => {
            draggedLetter = letter;
            letter.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', letter.dataset.letter);
            // Hide the letter from its original position
            setTimeout(() => {
                letter.style.display = 'none';
            }, 0);
        });

        letter.addEventListener('dragend', () => {
            letter.classList.remove('dragging');
            // Show the letter again if not dropped in a zone
            if (letter.parentElement.classList.contains('letters')) {
                letter.style.display = 'flex';
            }
        });
    });

    // Add drop zone event listeners
    dropZones.forEach((zone, index) => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.classList.add('highlight');
        });

        zone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            zone.classList.add('highlight');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('highlight');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('highlight');
            
            // If there's already a letter in this zone, return it to the letters container
            if (zone.dataset.letter) {
                const existingLetter = Array.from(letters).find(
                    l => l.dataset.letter === zone.dataset.letter
                );
                if (existingLetter) {
                    existingLetter.style.display = 'flex';
                }
            }
            
            // If we're dragging a letter
            if (draggedLetter) {
                // Remove from previous position
                if (draggedLetter.parentElement.classList.contains('drop-zone')) {
                    draggedLetter.parentElement.textContent = '';
                    draggedLetter.parentElement.dataset.letter = '';
                    currentWord[Array.from(dropZones).indexOf(draggedLetter.parentElement)] = '';
                } else {
                    // If coming from letters container, hide the original
                    draggedLetter.style.display = 'none';
                }
                
                // Add to new position
                zone.textContent = draggedLetter.dataset.letter;
                zone.dataset.letter = draggedLetter.dataset.letter;
                zone.classList.add('has-letter');
                
                // Update current word
                currentWord[index] = draggedLetter.dataset.letter;
                
                // Check if the word is complete
                checkWord();
            }
        });
    });

    function checkWord() {
        const word = currentWord.join('');
        if (word === targetWord) {
            setTimeout(() => {
                romanticMessage.style.display = 'block';
                romanticMessage.classList.remove('hidden');
                romanticMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Initialize message steps
                const messageSteps = document.querySelectorAll('.message-step');
                const nextButtons = document.querySelectorAll('.next-btn');
                const surpriseBtn = document.getElementById('surprise-btn');
                const surprise = document.querySelector('.surprise');
                
                // Show first step
                document.querySelector('.message-step[data-step="1"]').classList.add('active');
                
                // Handle next button clicks
                nextButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const currentStep = button.closest('.message-step');
                        const nextStepNum = parseInt(currentStep.dataset.step) + 1;
                        
                        // Fade out current step
                        currentStep.style.animation = 'fadeOut 0.5s ease-out forwards';
                        
                        // After fade out, show next step
                        setTimeout(() => {
                            currentStep.classList.remove('active');
                            const nextStep = document.querySelector(`.message-step[data-step="${nextStepNum}"]`);
                            if (nextStep) {
                                nextStep.classList.add('active');
                                nextStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }, 500);
                    });
                });
                
                // Handle surprise button
                if (surpriseBtn) {
                    surpriseBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.querySelector('.message-step[data-step="5"]').style.animation = 'fadeOut 0.5s ease-out forwards';
                        setTimeout(() => {
                            document.querySelector('.message-step[data-step="5"]').classList.remove('active');
                            surprise.classList.remove('hidden');
                            surprise.style.animation = 'fadeIn 1s ease-out';
                            
                            // Add confetti effect
                            const colors = ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8'];
                            const createConfetti = () => {
                                const confetti = document.createElement('div');
                                confetti.style.position = 'absolute';
                                confetti.style.width = '10px';
                                confetti.style.height = '10px';
                                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                                confetti.style.borderRadius = '50%';
                                confetti.style.left = Math.random() * 100 + 'vw';
                                confetti.style.top = '-10px';
                                confetti.style.opacity = '0';
                                document.body.appendChild(confetti);
                                
                                // Animate confetti
                                const animation = confetti.animate([
                                    { top: '-10px', opacity: 0, transform: 'rotate(0deg)' },
                                    { top: '10%', opacity: 1, offset: 0.2 },
                                    { top: '90%', opacity: 0.8, transform: 'rotate(360deg)' },
                                    { top: '100vh', opacity: 0 }
                                ], {
                                    duration: 2000 + Math.random() * 3000,
                                    easing: 'cubic-bezier(0.1, 0.8, 0.8, 1)'
                                });
                                
                                // Remove confetti after animation
                                animation.onfinish = () => confetti.remove();
                            };
                            
                            // Create multiple confetti pieces
                            for (let i = 0; i < 50; i++) {
                                setTimeout(createConfetti, i * 100);
                            }
                        }, 500);
                    });
                }
            }, 500);
        }
    }
});
