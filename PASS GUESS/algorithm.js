const startButton = document.getElementById('start-button');
        const resetButton = document.getElementById('reset-button');
        const pinLengthSelect = document.getElementById('pin-length');
        const controls = document.getElementById('controls');
        
        // New elements for custom PIN
        const customPinInput = document.getElementById('custom-pin');
        const pinError = document.getElementById('pin-error');
        
        const progressContainer = document.getElementById('progress-container');
        const currentGuessEl = document.getElementById('current-guess');
        const correctPinDisplayEl = document.getElementById('correct-pin-display');
        const guessCountEl = document.getElementById('guess-count');
        
        const successMessage = document.getElementById('success-message');
        const finalPinEl = document.getElementById('final-pin');
        const finalCountEl = document.getElementById('final-count');
        
        const safeDoor = document.getElementById('safe-door');
        const statusLight = document.getElementById('status-light');

        let correctPin = '';
        let currentGuess = 0;
        let guessCount = 0;
        let pinLength = 3;
        let maxCombinations = 1000;
        let intervalId = null;

        /**
         * Sets up the UI for the attack to start.
         */
        function setupAttackUI() {
            pinLength = parseInt(pinLengthSelect.value);
            maxCombinations = Math.pow(10, pinLength);
            
            // Set up the UI for the attack
            correctPinDisplayEl.textContent = '???'.padEnd(pinLength, '?');
            currentGuessEl.textContent = '0'.padStart(pinLength, '0');
            guessCountEl.textContent = '0';
            progressContainer.classList.remove('hidden');
            controls.classList.add('hidden');
            successMessage.classList.add('hidden');
            
            statusLight.classList.remove('bg-green-500');
            statusLight.classList.add('bg-red-600');
            safeDoor.classList.remove('unlocked');
        }

        /**
         * Formats a number as a string with leading zeros.
         */
        function formatGuess(num) {
            return num.toString().padStart(pinLength, '0');
        }

        /**
         * This is the core brute-force logic.
         * It's called repeatedly by setInterval.
         */
        function attemptGuess() {
            // Format the current guess (e.g., 1 -> "001")
            const guessString = formatGuess(currentGuess);
            
            // Update the display
            currentGuessEl.textContent = guessString;
            guessCountEl.textContent = guessCount.toLocaleString();

            // Test the guess
            if (guessString === correctPin) {
                // SUCCESS!
                clearInterval(intervalId); // Stop the guessing loop
                showSuccess();
            } else {
                // FAILED. Try the next one.
                currentGuess++;
                guessCount++;
            }
        }

        /**
         * Shows the success message and updates the UI.
         */
        function showSuccess() {
            progressContainer.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            finalPinEl.textContent = correctPin;
            finalCountEl.textContent = guessCount.toLocaleString();
            
            correctPinDisplayEl.textContent = correctPin;
            correctPinDisplayEl.classList.remove('text-red-500');
            correctPinDisplayEl.classList.add('text-green-400');
            
            statusLight.classList.remove('bg-red-600');
            statusLight.classList.add('bg-green-500');
            
            safeDoor.classList.add('unlocked');
        }

        /**
         * Starts the brute-force attack.
         */
        function startAttack() {
            pinLength = parseInt(pinLengthSelect.value);
            const userPin = customPinInput.value;

            // --- Validation ---
            const isNumeric = /^\d+$/.test(userPin); // Checks if it's only digits
            
            if (!isNumeric || userPin.length !== pinLength) {
                pinError.textContent = `PIN must be ${pinLength} digits.`;
                pinError.classList.remove('hidden');
                customPinInput.focus();
                return; // Stop the function
            }
            
            // --- Validation Passed ---
            pinError.classList.add('hidden');
            correctPin = userPin; // Set the correct PIN from user input

            // Set up the UI for the attack
            setupAttackUI();
            
            currentGuess = 0;
            guessCount = 1; // Start at 1 since we're checking 000
            
            // Determine speed based on combinations
            // We want 4-digit to feel faster so it doesn't take too long
            let speed = pinLength === 3 ? 10 : 0.1; // ms delay
            
            // Start the guessing loop
            intervalId = setInterval(attemptGuess, speed);
        }

        /**
         * Resets the game to its initial state.
         */
        function resetGame() {
            clearInterval(intervalId);
            progressContainer.classList.add('hidden');
            controls.classList.remove('hidden');
            successMessage.classList.add('hidden');
            
            statusLight.classList.remove('bg-green-500');
            statusLight.classList.add('bg-red-600');
            safeDoor.classList.remove('unlocked');
            
            correctPinDisplayEl.classList.add('text-red-500');
            correctPinDisplayEl.classList.remove('text-green-400');
        }
        
        /**
         * Updates placeholder and error message when PIN length changes.
         */
        function updatePinInputState() {
            const length = pinLengthSelect.value;
            customPinInput.placeholder = length === '3' ? 'e.g., 123' : 'e.g., 1234';
            customPinInput.maxLength = parseInt(length);
            pinError.textContent = `PIN must be ${length} digits.`;
            // Hide error if it was already showing
            if (!pinError.classList.contains('hidden')) {
                pinError.classList.add('hidden');
            }
        }

        // Event Listeners
        startButton.addEventListener('click', startAttack);
        resetButton.addEventListener('click', resetGame);
        pinLengthSelect.addEventListener('change', updatePinInputState);
        
        // Initialize the pin input state on load
        updatePinInputState();
