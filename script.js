// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', () => {
    const lettersContainer = document.querySelector('.letters');
    const dropZones = document.querySelectorAll('.drop-zone');
    const romanticMessage = document.getElementById('romantic-message');
    const targetWord = 'BONITA';
    let currentWord = Array(6).fill('');
    let currentLetterIndex = 0;
    
    // Create letter elements
    const letters = 'BONITA'.split('');
    const shuffledLetters = shuffleArray([...letters]);
    
    // Display shuffled letters
    lettersContainer.innerHTML = '';
    shuffledLetters.forEach((letter, index) => {
        const letterElement = document.createElement('div');
        letterElement.className = 'letter';
        letterElement.textContent = letter;
        letterElement.dataset.letter = letter;
        letterElement.dataset.index = index;
        lettersContainer.appendChild(letterElement);
        
        // Add click event to letters
        letterElement.addEventListener('click', () => {
            if (currentLetterIndex < targetWord.length) {
                const currentTargetLetter = targetWord[currentLetterIndex];
                
                if (letter === currentTargetLetter) {
                    // Add to current position
                    dropZones[currentLetterIndex].textContent = letter;
                    dropZones[currentLetterIndex].dataset.letter = letter;
                    dropZones[currentLetterIndex].classList.add('has-letter');
                    
                    // Hide the clicked letter
                    letterElement.style.visibility = 'hidden';
                    
                    // Update current word
                    currentWord[currentLetterIndex] = letter;
                    currentLetterIndex++;
                    
                    // Check if word is complete
                    checkWord();
                } else {
                    // Wrong letter - visual feedback
                    letterElement.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        letterElement.style.animation = '';
                    }, 500);
                }
            }
        });
    });

    // Function to reset the game
    function resetGame() {
        currentWord = Array(6).fill('');
        currentLetterIndex = 0;
        
        // Clear drop zones
        dropZones.forEach(zone => {
            zone.textContent = '';
            zone.dataset.letter = '';
            zone.classList.remove('has-letter');
        });
        
        // Show all letters
        document.querySelectorAll('.letter').forEach(letter => {
            letter.style.visibility = 'visible';
        });
        
        // Hide romantic message
        romanticMessage.style.display = 'none';
        romanticMessage.classList.add('hidden');
    }

    // Add click handler for reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar';
    resetButton.className = 'reset-btn';
    resetButton.addEventListener('click', resetGame);
    document.querySelector('.container').appendChild(resetButton);

    // Add drop zone event listeners
    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        e.currentTarget.classList.add('highlight');
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('highlight');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('highlight');
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const zone = dropZones[dropIndex];
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
            
            // Update current word with the correct drop index
            currentWord[dropIndex] = draggedLetter.dataset.letter;
            
            // Check if the word is complete
            checkWord();
        }
    };

    dropZones.forEach((zone) => {
        // Mouse events
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        
        // Drop event for mouse
        zone.addEventListener('drop', (e) => {
            const dropIndex = Array.from(dropZones).indexOf(e.currentTarget);
            handleDrop(e, dropIndex);
        });
        
        // Touch events
        zone.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Remove highlight from all zones
            dropZones.forEach(z => z.classList.remove('highlight'));
            
            if (element && element.classList.contains('drop-zone') && draggedLetter) {
                const dropIndex = Array.from(dropZones).indexOf(element);
                handleDrop(e, dropIndex);
            } else if (draggedLetter) {
                // Return letter to original position if not dropped in a zone
                draggedLetter.style.display = 'flex';
            }
        }, { passive: false });
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
    };
});
