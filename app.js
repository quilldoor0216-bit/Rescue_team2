document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const systemAlert = document.getElementById('system-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertClose = document.getElementById('alert-close');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const glitchOverlay = document.getElementById('glitch-overlay');
    const body = document.body;

    // Helper to clear persisted app state on each login
    function clearAppState() {
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('Failed to clear localStorage:', e);
        }
    }

    function showMessage(msg, type = 'error') {
        if (!alertMessage || !systemAlert) return;
        alertMessage.textContent = msg;
        systemAlert.className = `modal ${type}`;
        
        const modalFooter = systemAlert.querySelector('.modal-footer');
        if (modalFooter) {
            if (type === 'success') {
                modalFooter.style.display = 'none';
            } else {
                modalFooter.style.display = '';
            }
        }

        systemAlert.classList.remove('hidden');
    }

    function closeSystemAlert() {
        if (systemAlert && !systemAlert.classList.contains('hidden')) {
            systemAlert.classList.add('hidden');
            if (usernameInput) usernameInput.focus();
        }
    }

    function transitionToDashboard() {
        // Clear persisted state and reset in‑memory timers for a fresh start
        clearAppState();
        // Reset simulated chat start time and elapsed counter
        chatStartTime = new Date('2022-06-07T04:12:00');
        chatElapsedMs = 0;
        if (systemAlert) systemAlert.classList.add('hidden');
        sessionStorage.setItem('borderAuth', 'true');
        document.documentElement.classList.add('is-authenticated');
        if (loginScreen) {
            loginScreen.classList.remove('active');
            loginScreen.classList.add('hidden');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.add('active');
            dashboardScreen.classList.remove('hidden');
        }
    }

    // Auto-login if session exists
    if (sessionStorage.getItem('borderAuth') === 'true') {
        transitionToDashboard();
    }

    if (alertClose) {
        alertClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeSystemAlert();
        });
    }

    // Intercept Enter / Escape / Space when alert modal is visible to close it without re-submitting
    document.addEventListener('keydown', (e) => {
        if (systemAlert && !systemAlert.classList.contains('hidden')) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                closeSystemAlert();
            }
        }
    }, true);

    let failedAttempts = 0;

    const TARGET_ID = 'TEAM_R2_lead';
    const TARGET_PW = 'gkstprud1014';

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rawId = usernameInput ? usernameInput.value.trim() : '';
            const rawPw = passwordInput ? passwordInput.value : '';

            // Strict matching: ID is TEAM_R2_lead, PW can be gkstprud1014 or gkstprud1014@
            const idMatched = (rawId.toLowerCase() === TARGET_ID.toLowerCase());
            const pwMatched = (rawPw === TARGET_PW) || (rawPw === TARGET_PW + '@');

            if (idMatched && pwMatched) {
                // Success
                showMessage('AUTHENTICATION SUCCESSFUL.', 'success');
                setTimeout(() => {
                    transitionToDashboard();
                }, 800);
            } else {
                // Failure
                failedAttempts++;

                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';

                if (failedAttempts < 5) {
                    showMessage(`아이디 또는 비밀번호가 틀렸습니다. (${failedAttempts}/5회)`, 'error');
                } else {
                    // Hide default alert
                    if (systemAlert) systemAlert.classList.add('hidden');
                    
                    // Try to go fullscreen
                    try {
                        const docElm = document.documentElement;
                        if (docElm.requestFullscreen) {
                            docElm.requestFullscreen();
                        } else if (docElm.mozRequestFullScreen) {
                            docElm.mozRequestFullScreen();
                        } else if (docElm.webkitRequestFullScreen) {
                            docElm.webkitRequestFullScreen();
                        } else if (docElm.msRequestFullscreen) {
                            docElm.msRequestFullscreen();
                        }
                    } catch(err) {}
                    
                    // Block input
                    if (usernameInput) usernameInput.disabled = true;
                    if (passwordInput) passwordInput.disabled = true;
                    const btn = loginForm.querySelector('button');
                    if (btn) btn.disabled = true;
                    
                    // Show BSOD full screen
                    const bsod = document.getElementById('bsod-fullscreen');
                    const bsodText = document.getElementById('bsod-text');
                    
                    if (bsod && bsodText) {
                        bsod.classList.remove('hidden');
                        
                        const message = "FATAL EXCEPTION: 0x00000005 (UNAUTHORIZED_ACCESS)\nBORDER_SECURITY_PROTOCOL_INITIATED\n\n> purging local user data... [OK]\n> wiping session records... [OK]\n> enforcing connection drop... [OK]\n\n[ TERMINATE PROCESS ... ";
                        bsodText.textContent = '';
                        
                        let i = 0;
                        let spinnerFrames = ['|', '/', '-', '\\'];
                        let spinnerCount = 0;
                        let spinnerMax = 30;
                        let successWait = 0;

                        const typeWriter = setInterval(() => {
                            if (i < message.length) {
                                bsodText.textContent += message.charAt(i);
                                i++;
                            } else if (spinnerCount < spinnerMax) {
                                let frame = spinnerFrames[Math.floor(spinnerCount / 2) % 4];
                                bsodText.textContent = message + frame + " ]";
                                spinnerCount++;
                            } else if (spinnerCount === spinnerMax) {
                                bsodText.textContent = message + "SUCCEEDED ]";
                                spinnerCount++;
                            } else if (successWait < 15) { 
                                successWait++;
                            } else {
                                clearInterval(typeWriter);
                                setTimeout(() => {
                                    bsod.style.backgroundColor = '#000';
                                    bsodText.innerHTML = '';
                                    const noise = bsod.querySelector('.tv-noise');
                                    if (noise) noise.style.display = 'none';
                                    bsod.classList.add('bsod-final');
                                    
                                    setTimeout(() => {
                                        try {
                                            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                                            const osc = audioCtx.createOscillator();
                                            const gain = audioCtx.createGain();
                                            osc.type = 'triangle';
                                            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
                                            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                                            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
                                            osc.connect(gain);
                                            gain.connect(audioCtx.destination);
                                            osc.start();
                                            osc.stop(audioCtx.currentTime + 1.0);
                                        } catch(e) {}

                                        bsod.style.backgroundColor = '#0000ff';
                                        bsod.style.justifyContent = 'center';
                                        bsod.style.alignItems = 'center';
                                        bsodText.style.textAlign = 'center';
                                        bsodText.innerHTML = "WARNING!<br><br>The system is either busy or access is denied.<br>Please restart your browser to continue your work.<br><br>Sorry for the inconvenience.";
                                    }, 800);
                                }, 300);
                            }
                        }, 50);
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // Dashboard Navigation Logic
    // -------------------------------------------------------------
    const navItems = document.querySelectorAll('#main-nav li');
    const views = document.querySelectorAll('.content-area .view');
    const placeholderView = document.getElementById('placeholder-view');
    const placeholderTitle = document.getElementById('placeholder-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            const menuName = item.textContent;

            views.forEach(view => {
                view.classList.remove('active');
                view.classList.add('hidden');
            });

            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('active');
            } else if (placeholderView) {
                if (placeholderTitle) placeholderTitle.textContent = menuName;
                placeholderView.classList.remove('hidden');
                placeholderView.classList.add('active');
            }

            // Animate stat bars when moving to '조직 및 대원' (personnel)
            if (targetId === 'personnel') {
                const statBars = document.querySelectorAll('#personnel .stat-fill');
                statBars.forEach(bar => {
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                });

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        statBars.forEach(bar => {
                            bar.style.transition = 'width 1.5s cubic-bezier(0.1, 1, 0.2, 1)';
                            const row = bar.closest('.stat-row');
                            const input = row ? row.querySelector('.stat-val-input') : null;
                            if (input) {
                                let valStr = input.value.trim().replace('%', '');
                                    if (valStr === '???') {
                                        // Unknown value – pink
                                        bar.style.width = '100%';
                                        // Clear previous colour classes
                                        bar.classList.remove('bg-success', 'bg-red', 'bg-orange', 'bg-yellow', 'bg-green', 'bg-red-black', 'bg-unknown');
                                        bar.classList.add('bg-unknown');
                                    } else {
                                        // Normal numeric handling
                                        let num = parseInt(valStr);
                                        if (isNaN(num)) {
                                            // Treat NaN as green (default)
                                            bar.style.width = '100%';
                                            bar.classList.remove('bg-success', 'bg-red', 'bg-orange', 'bg-yellow', 'bg-green', 'bg-red-black', 'bg-unknown');
                                            bar.classList.add('bg-green');
                                        } else {
                                            bar.style.width = num + '%';
                                            // Clear any previous bg classes
                                            bar.classList.remove('bg-success', 'bg-red', 'bg-orange', 'bg-yellow', 'bg-red-black', 'bg-unknown', 'bg-green');
                                            if (num <= 10) {
                                                bar.classList.add('bg-red-black');
                                            } else if (num <= 30) {
                                                bar.classList.add('bg-red');
                                            } else if (num < 50) {
                                                bar.classList.add('bg-orange');
                                            } else if (num <= 70) {
                                                bar.classList.add('bg-yellow');
                                            } else {
                                                bar.classList.add('bg-green');
                                            }
                                        }
                                    }
                            }
                        });
                    }, 50);
                });
            }
        });
    });

    // -------------------------------------------------------------
    // More Dropdown Menu
    // -------------------------------------------------------------
    const moreMenuBtn = document.getElementById('more-menu-btn');
    const moreDropdown = document.getElementById('more-dropdown');

    if (moreMenuBtn && moreDropdown) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreDropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!moreDropdown.contains(e.target) && e.target !== moreMenuBtn) {
                moreDropdown.classList.remove('open');
            }
        });
    }

    // Close sidebar button
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    if (closeSidebarBtn && moreDropdown) {
        closeSidebarBtn.addEventListener('click', () => {
            moreDropdown.classList.remove('open');
        });
    }

    // -------------------------------------------------------------
    // Floating Team Leader Chat Window (KakaoTalk Style)
    // -------------------------------------------------------------
    const leaderChatLink = document.getElementById('leader-chat-link');
    const floatingChatWindow = document.getElementById('floating-chat-window');
    const chatWindowHeader = document.getElementById('chat-window-header');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMinimizeBtn = document.getElementById('chat-minimize-btn');

    if (leaderChatLink) {
        leaderChatLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (moreDropdown) {
                moreDropdown.classList.remove('open');
            }
            // Open separate popout OS window by default
            try {
                const popWin = window.open('chat_popout.html', 'BorderTeamLeaderChat', 'width=420,height=650,resizable=yes,scrollbars=no');
                if (popWin) {
                    popWin.focus();
                    return;
                }
            } catch(err) {}

            // Fallback to in-page floating window if popup blocked
            if (floatingChatWindow) {
                floatingChatWindow.classList.remove('hidden');
                const chatInputEl = document.getElementById('chat-input');
                if (chatInputEl) {
                    setTimeout(() => chatInputEl.focus(), 50);
                }
            }
        });
    }

    if (chatCloseBtn && floatingChatWindow) {
        chatCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingChatWindow.classList.add('hidden');
        });
    }

    if (chatMinimizeBtn && floatingChatWindow) {
        chatMinimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingChatWindow.classList.add('hidden');
        });
    }

    // Draggable Window Logic
    if (floatingChatWindow && chatWindowHeader) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        function startDrag(clientX, clientY) {
            isDragging = true;
            startX = clientX;
            startY = clientY;

            const rect = floatingChatWindow.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            floatingChatWindow.style.left = startLeft + 'px';
            floatingChatWindow.style.top = startTop + 'px';
            floatingChatWindow.style.right = 'auto';
            floatingChatWindow.style.bottom = 'auto';
        }

        function moveDrag(clientX, clientY) {
            if (!isDragging) return;
            const dx = clientX - startX;
            const dy = clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const maxLeft = Math.max(0, window.innerWidth - floatingChatWindow.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - floatingChatWindow.offsetHeight);

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            floatingChatWindow.style.left = newLeft + 'px';
            floatingChatWindow.style.top = newTop + 'px';
        }

        function endDrag() {
            isDragging = false;
        }

        chatWindowHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            startDrag(e.clientX, e.clientY);
            
            const onMouseMove = (ev) => {
                ev.preventDefault();
                moveDrag(ev.clientX, ev.clientY);
            };
            const onMouseUp = () => {
                endDrag();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        chatWindowHeader.addEventListener('touchstart', (e) => {
            if (e.target.closest('button')) return;
            const touch = e.touches[0];
            if (touch) {
                startDrag(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            if (touch) {
                moveDrag(touch.clientX, touch.clientY);
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isDragging) endDrag();
        });
    }

    const chatPopoutBtn = document.getElementById('chat-popout-btn');
    const chatMaximizeBtn = document.getElementById('chat-maximize-btn');
    const chatResizeHandle = document.getElementById('chat-resize-handle');

    let isChatMaximized = false;
    let savedChatRect = null;

    if (chatPopoutBtn) {
        chatPopoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (floatingChatWindow) {
                floatingChatWindow.classList.add('hidden');
            }
            window.open('chat_popout.html', 'BorderTeamLeaderChat', 'width=420,height=650,resizable=yes,scrollbars=no');
        });
    }

    if (chatMaximizeBtn && floatingChatWindow) {
        chatMaximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isChatMaximized) {
                const rect = floatingChatWindow.getBoundingClientRect();
                savedChatRect = {
                    left: floatingChatWindow.style.left || (rect.left + 'px'),
                    top: floatingChatWindow.style.top || (rect.top + 'px'),
                    right: floatingChatWindow.style.right,
                    bottom: floatingChatWindow.style.bottom,
                    width: floatingChatWindow.style.width || (rect.width + 'px'),
                    height: floatingChatWindow.style.height || (rect.height + 'px')
                };
                floatingChatWindow.style.left = '40px';
                floatingChatWindow.style.top = '70px';
                floatingChatWindow.style.right = 'auto';
                floatingChatWindow.style.bottom = 'auto';
                floatingChatWindow.style.width = 'calc(100vw - 80px)';
                floatingChatWindow.style.height = 'calc(100vh - 100px)';
                chatMaximizeBtn.textContent = '❐';
                chatMaximizeBtn.title = '이전 크기로 복원';
                isChatMaximized = true;
            } else {
                if (savedChatRect) {
                    floatingChatWindow.style.left = savedChatRect.left;
                    floatingChatWindow.style.top = savedChatRect.top;
                    floatingChatWindow.style.right = savedChatRect.right;
                    floatingChatWindow.style.bottom = savedChatRect.bottom;
                    floatingChatWindow.style.width = savedChatRect.width;
                    floatingChatWindow.style.height = savedChatRect.height;
                } else {
                    floatingChatWindow.style.left = 'auto';
                    floatingChatWindow.style.top = 'auto';
                    floatingChatWindow.style.right = '40px';
                    floatingChatWindow.style.bottom = '40px';
                    floatingChatWindow.style.width = '380px';
                    floatingChatWindow.style.height = '560px';
                }
                chatMaximizeBtn.textContent = '□';
                chatMaximizeBtn.title = '최대화';
                isChatMaximized = false;
            }
        });
    }

    // Resize Handle Logic
    if (chatResizeHandle && floatingChatWindow) {
        let isResizing = false;
        let rStartX = 0, rStartY = 0;
        let rStartWidth = 0, rStartHeight = 0;

        chatResizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            isResizing = true;
            rStartX = e.clientX;
            rStartY = e.clientY;

            const rect = floatingChatWindow.getBoundingClientRect();
            rStartWidth = rect.width;
            rStartHeight = rect.height;

            floatingChatWindow.style.left = rect.left + 'px';
            floatingChatWindow.style.top = rect.top + 'px';
            floatingChatWindow.style.right = 'auto';
            floatingChatWindow.style.bottom = 'auto';

            const onResizeMove = (ev) => {
                if (!isResizing) return;
                ev.preventDefault();
                const dw = ev.clientX - rStartX;
                const dh = ev.clientY - rStartY;

                const newWidth = Math.max(320, Math.min(window.innerWidth - rect.left - 10, rStartWidth + dw));
                const newHeight = Math.max(400, Math.min(window.innerHeight - rect.top - 10, rStartHeight + dh));

                floatingChatWindow.style.width = newWidth + 'px';
                floatingChatWindow.style.height = newHeight + 'px';
            };

            const onResizeUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onResizeMove);
                document.removeEventListener('mouseup', onResizeUp);
            };

            document.addEventListener('mousemove', onResizeMove);
            document.addEventListener('mouseup', onResizeUp);
        });
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('borderAuth');
            location.reload();
        });
    }

    // -------------------------------------------------------------
    // Quick Actions Navigation (Dashboard)
    // -------------------------------------------------------------
    const btnQuickUpload = document.getElementById('btn-quick-upload');
    if (btnQuickUpload) {
        btnQuickUpload.addEventListener('click', () => {
            const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'reports');
            if (targetNav) targetNav.click();
        });
    }

    const btnEditStats = document.getElementById('btn-edit-stats');
    if (btnEditStats) {
        btnEditStats.addEventListener('click', () => {
            const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'personnel');
            if (targetNav) targetNav.click();
        });
    }

    const updateStat = (input) => {
        const row = input.closest('.stat-row');
        if (!row) return;
        const barFill = row.querySelector('.stat-fill');
        
        if (input && barFill) {
            let rawVal = input.value.trim().replace('%', '');
            let displayVal = '';
            let widthVal = 0;
            let stateClass = '';

            if (rawVal === '???') {
                displayVal = '???';
                widthVal = 100;
                stateClass = 'unknown';
                barFill.className = 'stat-fill bg-unknown';
            } else if (rawVal === 'NaN') {
                // Treat NaN as normal (green) value
                displayVal = 'NaN';
                widthVal = 100;
                stateClass = 'success';
                barFill.className = 'stat-fill bg-success';
            } else {
                let numVal = parseInt(rawVal);
                if (isNaN(numVal)) numVal = 0;
                if (numVal > 100) numVal = 100;
                if (numVal < 0) numVal = 0;
                
                displayVal = numVal + '%';
                widthVal = numVal;
                
                if (numVal <= 10) {
                    stateClass = 'red-black';
                } else if (numVal <= 30) {
                    stateClass = 'red';
                } else if (numVal < 50) {
                    stateClass = 'orange';
                } else if (numVal <= 70) {
                    stateClass = 'yellow';
                } else {
                    stateClass = 'green';
                }
                barFill.className = `stat-fill bg-${stateClass}`;
            }

            input.value = displayVal;
            barFill.style.width = widthVal + '%';
            
            input.className = 'stat-val-input';
            if (stateClass === 'critical') input.classList.add('text-critical');
            else if (stateClass === 'danger' || stateClass.includes('danger')) input.classList.add('text-danger');
            else if (stateClass === 'orange') input.classList.add('text-orange');
            else if (stateClass === 'warning') input.classList.add('text-warning');
            else input.classList.add('text-success');

            if (typeof updateTeamStatus === 'function') {
                updateTeamStatus();
            }
        }
    };

    document.querySelectorAll('.stat-val-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
        input.addEventListener('blur', () => {
            updateStat(input);
        });
        input.addEventListener('input', () => {
            if (typeof updateTeamStatus === 'function') {
                updateTeamStatus();
            }
        });
    });

    // -------------------------------------------------------------
    // Incident Input Autocomplete in Report
    // -------------------------------------------------------------
    const incPrefixInput = document.getElementById('inc-prefix-input');
    const incSuffixInput = document.getElementById('inc-suffix-input');
    const incNumInput = document.getElementById('inc-num-input');
    const apDisplay = document.getElementById('ap-display');
    const acDisplay = document.getElementById('ac-display');

    function syncIncidentNumberToDisplays() {
        let val = '';
        if (incPrefixInput || incSuffixInput) {
            const p = incPrefixInput ? incPrefixInput.value : '';
            const s = incSuffixInput ? incSuffixInput.value : '';
            val = (p || s) ? (p + s) : '';
        } else if (incNumInput) {
            val = incNumInput.value.trim();
        }
        if (apDisplay) apDisplay.value = val;
        if (acDisplay) acDisplay.value = val;
    }

    if (incPrefixInput) incPrefixInput.addEventListener('input', syncIncidentNumberToDisplays);
    if (incSuffixInput) incSuffixInput.addEventListener('input', syncIncidentNumberToDisplays);
    if (incNumInput) incNumInput.addEventListener('input', syncIncidentNumberToDisplays);

    // -------------------------------------------------------------
    // Helper: Grade Badge Generator
    // -------------------------------------------------------------
    function getGradeBadge(grade) {
        if (!grade) return '<span class="badge badge-dark">미지정</span>';
        if (grade.includes('흑') || grade.toLowerCase().includes('black')) {
            return '<span class="badge badge-grade-black">흑 (Black)</span>';
        } else if (grade.includes('적') || grade.toLowerCase().includes('red')) {
            return '<span class="badge badge-grade-red">적 (Red)</span>';
        } else if (grade.includes('황') || grade.toLowerCase().includes('yellow')) {
            return '<span class="badge badge-grade-yellow">황 (Yellow)</span>';
        } else if (grade.includes('녹') || grade.toLowerCase().includes('green')) {
            return '<span class="badge badge-grade-green">녹 (Green)</span>';
        } else if (grade.includes('청') || grade.toLowerCase().includes('blue')) {
            return '<span class="badge badge-grade-blue">청 (Blue)</span>';
        }
        return `<span class="badge badge-dark">${grade}</span>`;
    }

    // -------------------------------------------------------------
    // Helper: Extract Summary from Frozen Report HTML
    // -------------------------------------------------------------
    function extractSummaryFromFrozen(container) {
        let incNum = '-';
        let title = '현장 구조 활동 보고서';
        let author = '-';
        let date = '-';
        let grade = '흑';

        const fields = container.querySelectorAll('.doc-field, .doc-field-block');
        fields.forEach(f => {
            const lbl = f.querySelector('label');
            const valEl = f.querySelector('.frozen-val');
            if (!lbl || !valEl) return;
            const text = lbl.textContent;
            const val = valEl.textContent.trim();
            
            if (text.includes('보고서 제목') || text.includes('보고서제목')) {
                if (val && val !== '-') title = val;
            } else if (text.includes('사건 번호') || text.includes('사건번호')) {
                const vals = Array.from(f.querySelectorAll('.frozen-val')).map(v => v.textContent.trim()).filter(Boolean);
                if (vals.length > 0) {
                    const combined = vals.join('');
                    if (combined && combined !== '-') incNum = combined;
                }
            } else if (text.includes('작성자')) {
                if (val && val !== '-') author = val;
            } else if (text.includes('출동 요청 일시') || text.includes('발생 일시') || text.includes('작성 일시')) {
                if (val && val !== '-') {
                    if (date === '-' || text.includes('출동 요청 일시')) {
                        date = val;
                    }
                }
            }
        });

        // Extract grade from entity grade section
        const gradeBlock = Array.from(container.querySelectorAll('.doc-field-block, .doc-row')).find(b => {
            const lbl = b.querySelector('label');
            return lbl && (lbl.textContent.includes('개체 등급') || lbl.textContent.includes('개체등급'));
        });

        if (gradeBlock) {
            const checkedSpan = Array.from(gradeBlock.querySelectorAll('.frozen-chk')).find(chk => chk.textContent.includes('☑'));
            if (checkedSpan && checkedSpan.parentElement) {
                grade = checkedSpan.parentElement.textContent.trim().replace('☑', '').trim();
            }
        }

        return {
            incNum: incNum,
            title: title,
            author: author,
            date: date,
            grade: grade
        };
    }

    // -------------------------------------------------------------
    // Rescue Report Form & Incident Log Logic
    // -------------------------------------------------------------
    const rescueReportForm = document.getElementById('rescue-report-form');
    const incidentLogsTbody = document.querySelector('#incident-logs tbody');
    const readonlyModal = document.getElementById('readonly-modal');
    const readonlyBody = document.getElementById('readonly-body');
    const closeReadonlyBtn = document.getElementById('close-readonly-btn');

    if (closeReadonlyBtn && readonlyModal) {
        closeReadonlyBtn.addEventListener('click', () => {
            readonlyModal.classList.add('hidden');
        });
    }

    let isSubmittingReport = false;

    if (rescueReportForm) {
        rescueReportForm.setAttribute('autocomplete', 'off');
        rescueReportForm.querySelectorAll('input, textarea').forEach(el => {
            el.setAttribute('autocomplete', 'off');
        });

        rescueReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isSubmittingReport) return;
            isSubmittingReport = true;
            
            showMessage('보고서를 암호화하여 서버에 전송 중입니다...', 'warning');
            
            // Freeze form HTML immediately
            const clone = rescueReportForm.cloneNode(true);
            
            // Process inputs & selects
            const inputs = Array.from(rescueReportForm.querySelectorAll('input[type="text"], select'));
            const cloneInputs = Array.from(clone.querySelectorAll('input[type="text"]'));
            inputs.forEach((input, i) => {
                const span = document.createElement('span');
                span.textContent = input.value || ' ';
                span.className = 'frozen-val';
                span.style.padding = '0 4px';
                span.style.display = 'inline-block';
                span.style.minWidth = 'auto';
                if (cloneInputs[i] && cloneInputs[i].parentNode) {
                    cloneInputs[i].parentNode.replaceChild(span, cloneInputs[i]);
                }
            });

            // Process radios & checkboxes
            const checks = Array.from(rescueReportForm.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
            const cloneChecks = Array.from(clone.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
            checks.forEach((chk, i) => {
                const span = document.createElement('span');
                span.className = 'frozen-chk';
                span.textContent = chk.checked ? '☑ ' : '☐ ';
                span.style.color = chk.checked ? 'var(--success)' : '#777';
                span.style.fontWeight = 'bold';
                span.style.marginRight = '4px';
                if (cloneChecks[i] && cloneChecks[i].parentNode) {
                    cloneChecks[i].parentNode.replaceChild(span, cloneChecks[i]);
                }
            });

            // Process textareas
            const textareas = Array.from(rescueReportForm.querySelectorAll('textarea'));
            const cloneTextareas = Array.from(clone.querySelectorAll('textarea'));
            textareas.forEach((ta, i) => {
                const div = document.createElement('div');
                div.className = 'frozen-val';
                div.style.whiteSpace = 'pre-wrap';
                div.style.padding = '10px';
                div.style.background = 'rgba(255,255,255,0.03)';
                div.style.border = '1px solid #333';
                div.style.borderRadius = '4px';
                div.style.marginTop = '5px';
                div.textContent = ta.value || '(내용 없음)';
                if (cloneTextareas[i] && cloneTextareas[i].parentNode) {
                    cloneTextareas[i].parentNode.replaceChild(div, cloneTextareas[i]);
                }
            });

            // Remove submit buttons from clone
            clone.querySelectorAll('button').forEach(b => b.remove());

            // Capture field values
            const incPrefixInput = document.getElementById('inc-prefix-input');
            const incSuffixInput = document.getElementById('inc-suffix-input');
            const legacyIncInput = document.getElementById('inc-num-input');
            let incNum = '-';
            if (incPrefixInput || incSuffixInput) {
                const p = incPrefixInput ? incPrefixInput.value.trim() : '';
                const s = incSuffixInput ? incSuffixInput.value.trim() : '';
                incNum = (p || s) ? (p + s) : '-';
            } else if (legacyIncInput) {
                incNum = legacyIncInput.value.trim() || '-';
            }

            const titleInput = document.getElementById('report-title-input');
            const title = (titleInput ? titleInput.value.trim() : '') || '현장 구조 활동 보고서';
            const authorInput = document.getElementById('author-input');
            const author = (authorInput ? authorInput.value.trim() : '') || '-';
            const dateInput = document.getElementById('dispatch-req-date');
            const date = (dateInput ? dateInput.value.trim() : '') || '-';
            
            const checkedGrade = rescueReportForm.querySelector('input[name="entity_grade"]:checked');
            const gradeVal = checkedGrade ? checkedGrade.value : '흑';
            const frozenHtml = clone.innerHTML;

            setTimeout(() => {
                showMessage('보고서 등록이 완료되었습니다.', 'success');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 2000);
                
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.innerHTML = `
                    <td>${incNum}</td>
                    <td>${title}</td>
                    <td>${author}</td>
                    <td>${date}</td>
                    <td>${getGradeBadge(gradeVal)}</td>
                `;
                
                tr.dataset.frozen = frozenHtml;
                
                tr.addEventListener('click', () => {
                    window.currentViewingRow = tr;
                    if (readonlyBody) {
                        readonlyBody.innerHTML = tr.dataset.frozen;
                        readonlyBody.querySelectorAll('.frozen-val').forEach(el => {
                            el.style.minWidth = 'auto';
                            el.style.padding = '0 4px';
                        });
                        readonlyBody.querySelectorAll('.doc-field label, .doc-field-block label').forEach(lbl => {
                            lbl.style.minWidth = 'auto';
                        });
                    }
                    const editBtn = document.getElementById('edit-report-btn');
                    if (editBtn) {
                        const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
                        editBtn.innerHTML = pencilSvg;
                        editBtn.title = '수정';
                    }
                    if (readonlyModal) readonlyModal.classList.remove('hidden');
                });

                if (incidentLogsTbody) {
                    const firstRow = incidentLogsTbody.querySelector('tr');
                    if (firstRow && firstRow.textContent.includes('없습니다')) {
                        firstRow.remove();
                    }
                    incidentLogsTbody.insertAdjacentElement('afterbegin', tr);
                }

                saveReportsToLocal();
                
                // Switch to incident logs tab
                const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'incident-logs');
                if (targetNav) targetNav.click();
                
                // Reset form
                rescueReportForm.reset();
                if (apDisplay) apDisplay.value = '';
                if (acDisplay) acDisplay.value = '';
                
                isSubmittingReport = false;
            }, 800);
        });
    }

    const deleteBtn = document.getElementById('delete-report-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('이 보고서를 영구 삭제하시겠습니까?')) {
                if (window.currentViewingRow) {
                    window.currentViewingRow.remove();
                    saveReportsToLocal();
                }
                if (readonlyModal) readonlyModal.classList.add('hidden');
                showMessage('보고서가 삭제되었습니다.', 'warning');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 2000);
            }
        });
    }

    const editBtn = document.getElementById('edit-report-btn');
    if (editBtn) {
        let isEditingMode = false;
        const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
        const saveSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
        
        function toggleCheckbox(chkSpan) {
            const parentGroup = chkSpan.closest('.doc-check-group');
            const prevLabel = parentGroup && parentGroup.previousElementSibling ? parentGroup.previousElementSibling.textContent : '';
            const parentLabel = parentGroup && parentGroup.parentElement && parentGroup.parentElement.querySelector('label') ? parentGroup.parentElement.querySelector('label').textContent : '';
            const labelText = prevLabel + ' ' + parentLabel;

            const isRadioGroup = parentGroup && (
                labelText.includes('문서 상태') ||
                labelText.includes('문서상태') ||
                labelText.includes('개체 등급') ||
                labelText.includes('개체등급') ||
                labelText.includes('여부')
            ) && !labelText.includes('현장 상태') && !labelText.includes('현장상태');
            
            if (isRadioGroup) {
                parentGroup.querySelectorAll('.frozen-chk').forEach(s => {
                    s.textContent = '☐ ';
                    s.style.color = '#777';
                });
                chkSpan.textContent = '☑ ';
                chkSpan.style.color = 'var(--success)';
            } else {
                const isChecked = chkSpan.textContent.includes('☑');
                if (isChecked) {
                    chkSpan.textContent = '☐ ';
                    chkSpan.style.color = '#777';
                } else {
                    chkSpan.textContent = '☑ ';
                    chkSpan.style.color = 'var(--success)';
                }
            }
        }

        editBtn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            if (isEditingMode) {
                // Save mode
                if (readonlyBody) {
                    const vals = readonlyBody.querySelectorAll('.frozen-val');
                    vals.forEach(v => {
                        v.contentEditable = false;
                        v.style.backgroundColor = 'transparent';
                        v.style.border = v.dataset.oldBorder || 'none';
                    });
                    
                    const checks = readonlyBody.querySelectorAll('.frozen-chk');
                    checks.forEach(c => {
                        c.style.cursor = 'default';
                        c.style.color = c.textContent.includes('☑') ? 'var(--success)' : '#777';
                        c.onclick = null;
                        if (c.parentElement && c.parentElement.tagName.toLowerCase() === 'label') {
                            c.parentElement.style.cursor = 'default';
                            c.parentElement.onclick = null;
                        }
                    });
                }
                targetBtn.innerHTML = pencilSvg;
                targetBtn.title = '수정';
                isEditingMode = false;
                
                if (window.currentViewingRow && readonlyBody) {
                    window.currentViewingRow.dataset.frozen = readonlyBody.innerHTML;
                    
                    // Immediately update visible table row columns with edited data
                    const summary = extractSummaryFromFrozen(readonlyBody);
                    window.currentViewingRow.innerHTML = `
                        <td>${summary.incNum}</td>
                        <td>${summary.title}</td>
                        <td>${summary.author}</td>
                        <td>${summary.date}</td>
                        <td>${getGradeBadge(summary.grade)}</td>
                    `;
                    
                    saveReportsToLocal();
                }
                showMessage('수정 사항이 저장되었습니다.', 'success');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 1500);
            } else {
                // Edit mode
                if (readonlyBody) {
                    const vals = readonlyBody.querySelectorAll('.frozen-val');
                    vals.forEach(v => {
                        v.contentEditable = true;
                        v.dataset.oldBorder = v.style.border;
                        v.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        v.style.border = '1px dashed #aaa';
                        v.style.outline = 'none';
                    });
                    
                    const checks = readonlyBody.querySelectorAll('.frozen-chk');
                    checks.forEach(c => {
                        c.style.cursor = 'pointer';
                        c.style.userSelect = 'none';
                        if (c.parentElement && c.parentElement.tagName.toLowerCase() === 'label') {
                            c.parentElement.style.cursor = 'pointer';
                            c.parentElement.style.userSelect = 'none';
                            c.parentElement.onclick = function(ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleCheckbox(c);
                            };
                        } else {
                            c.onclick = function(ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleCheckbox(c);
                            };
                        }
                    });
                }
                targetBtn.innerHTML = saveSvg;
                targetBtn.title = '저장';
                isEditingMode = true;
            }
        });
        
        if (closeReadonlyBtn) {
            closeReadonlyBtn.addEventListener('click', () => {
                isEditingMode = false;
                editBtn.innerHTML = pencilSvg;
                editBtn.title = '수정';
            });
        }
    }

    // -------------------------------------------------------------
    // Dynamic Anomalies & Entities Generation & Search
    // -------------------------------------------------------------
    const anomaliesContainer = document.getElementById('anomalies-list-container');
    const entitiesContainer = document.getElementById('entities-list-container');
    
    const annotations = {
        97: '<span style="margin-left: 10px; color: #d500f9; font-weight: bold;">[N-01]</span>',
        200: '<span style="margin-left: 10px; color: #ffea00; font-weight: bold;">[D-01]</span>',
        333: '<span style="margin-left: 10px; color: #2196f3; font-weight: bold;">[구조 2팀]</span>',
        781: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀/팀장]</span>',
        793: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        821: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        866: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        1079: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>',
        1111: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>',
        1144: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀/팀장]</span>',
        1218: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>'
    };

    const generateRows = (prefix, maxCount = 3110) => {
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= maxCount; i++) {
            const div = document.createElement('div');
            const paddedNum = i.toString().padStart(4, '0');
            div.id = `${prefix}-${paddedNum}`;
            div.className = 'db-row';
            div.style.padding = '8px 15px';
            div.style.borderBottom = '1px solid var(--border-color)';
            div.style.color = 'var(--text-primary)';
            div.style.fontFamily = 'monospace';
            div.style.fontSize = '15px';
            
            const anno = annotations[i] || '';
            const isBold = !!anno || i === 700;
            const nameHtml = isBold 
                ? `<strong style="font-weight: 800; color: #ffffff;">BORDER - KR - ${paddedNum}</strong>` 
                : `BORDER - KR - ${paddedNum}`;
            div.innerHTML = `${nameHtml}${anno}`;
            fragment.appendChild(div);
        }
        return fragment;
    };

    if (anomaliesContainer) {
        anomaliesContainer.innerHTML = '';
        anomaliesContainer.appendChild(generateRows('anom', 1286));
    }
    if (entitiesContainer) {
        entitiesContainer.innerHTML = '';
        entitiesContainer.appendChild(generateRows('ent', 1286));
    }

    const searchAnom = document.getElementById('search-anom');
    if (searchAnom) {
        searchAnom.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchAnom.value.trim();
                let numMatch = query.match(/\d+/);
                if (numMatch) {
                    let num = parseInt(numMatch[0]);
                    let paddedNum = num.toString().padStart(4, '0');
                    let targetId = 'anom-' + paddedNum;
                    let targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        document.querySelectorAll('#anomalies .db-row').forEach(row => row.style.backgroundColor = '');
                        targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        setTimeout(() => {
                            targetEl.style.transition = 'background-color 1s';
                            targetEl.style.backgroundColor = '';
                            setTimeout(() => { targetEl.style.transition = ''; }, 1000);
                        }, 1000);
                    }
                }
            }
        });
    }

    const searchEnt = document.getElementById('search-ent');
    if (searchEnt) {
        searchEnt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchEnt.value.trim();
                let numMatch = query.match(/\d+/);
                if (numMatch) {
                    let num = parseInt(numMatch[0]);
                    let paddedNum = num.toString().padStart(4, '0');
                    let targetId = 'ent-' + paddedNum;
                    let targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        document.querySelectorAll('#entity-logs .db-row').forEach(row => row.style.backgroundColor = '');
                        targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        setTimeout(() => {
                            targetEl.style.transition = 'background-color 1s';
                            targetEl.style.backgroundColor = '';
                            setTimeout(() => { targetEl.style.transition = ''; }, 1000);
                        }, 1000);
                    }
                }
            }
        });
    }

    // Initial team status update
    if (typeof updateTeamStatus === 'function') {
        updateTeamStatus();
    }
});

// Auto-resize textareas
document.addEventListener('input', function (event) {
    if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'textarea') {
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight) + 'px';
    }
    
    // Auto-format date inputs (YYYY.MM.DD.)
    if (event.target && event.target.classList && event.target.classList.contains('date-auto-format')) {
        if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
            return;
        }
        let val = event.target.value;
        let digits = val.replace(/\D/g, '').slice(0, 8);
        let formatted = '';
        if (digits.length <= 4) {
            formatted = digits;
            if (digits.length === 4) formatted += '.';
        } else if (digits.length <= 6) {
            formatted = digits.slice(0, 4) + '.' + digits.slice(4);
            if (digits.length === 6) formatted += '.';
        } else {
            formatted = digits.slice(0, 4) + '.' + digits.slice(4, 6) + '.' + digits.slice(6);
            if (digits.length === 8) formatted += '.';
        }
        event.target.value = formatted;
    }
}, false);

// Persistent Local Storage Logic for Reports
function saveReportsToLocal() {
    const logTableBody = document.querySelector('#incident-logs tbody');
    if (!logTableBody) return;
    const rows = logTableBody.querySelectorAll('tr');
    const reports = [];
    rows.forEach(tr => {
        if (tr.querySelector('td[colspan]')) return;
        const cols = tr.querySelectorAll('td');
        if (cols.length >= 5) {
            reports.push({
                incNum: cols[0].textContent.trim(),
                title: cols[1].textContent.trim(),
                author: cols[2].textContent.trim(),
                date: cols[3].textContent.trim(),
                gradeHtml: cols[4].innerHTML.trim(),
                frozenHtml: tr.dataset.frozen || ''
            });
        }
    });
    localStorage.setItem('border_reports', JSON.stringify(reports));
}

function loadReportsFromLocal() {
    const saved = localStorage.getItem('border_reports');
    if (!saved) return;
    
    try {
        const reports = JSON.parse(saved);
        if (!Array.isArray(reports) || reports.length === 0) return;
        
        const logTableBody = document.querySelector('#incident-logs tbody');
        if (!logTableBody) return;
        logTableBody.innerHTML = '';
        
        const readonlyBody = document.getElementById('readonly-body');
        const readonlyModal = document.getElementById('readonly-modal');
        
        function getGradeBadgeLocal(grade) {
            if (!grade) return '<span class="badge badge-dark">미지정</span>';
            if (grade.includes('흑') || grade.toLowerCase().includes('black')) {
                return '<span class="badge badge-grade-black">흑 (Black)</span>';
            } else if (grade.includes('적') || grade.toLowerCase().includes('red')) {
                return '<span class="badge badge-grade-red">적 (Red)</span>';
            } else if (grade.includes('황') || grade.toLowerCase().includes('yellow')) {
                return '<span class="badge badge-grade-yellow">황 (Yellow)</span>';
            } else if (grade.includes('녹') || grade.toLowerCase().includes('green')) {
                return '<span class="badge badge-grade-green">녹 (Green)</span>';
            } else if (grade.includes('청') || grade.toLowerCase().includes('blue')) {
                return '<span class="badge badge-grade-blue">청 (Blue)</span>';
            }
            return `<span class="badge badge-dark">${grade}</span>`;
        }

        reports.forEach(data => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            let incNum = data.incNum || '';
            let title = data.title || '';
            let author = data.author || '';
            let date = data.date || '';
            let gradeHtml = data.gradeHtml || '';

            // Migrate legacy unstructured entries
            if (data.innerHTML && !data.incNum) {
                const tempTr = document.createElement('tr');
                tempTr.innerHTML = data.innerHTML;
                const cols = tempTr.querySelectorAll('td');
                if (cols.length >= 5) {
                    incNum = cols[0].textContent.trim();
                    title = cols[1].textContent.trim();
                    if (cols[2].textContent.includes('202') || cols[2].textContent.includes('-')) {
                        date = cols[2].textContent.trim();
                        author = cols[3].textContent.trim();
                    } else {
                        author = cols[2].textContent.trim();
                        date = cols[3].textContent.trim();
                    }
                    gradeHtml = cols[4].innerHTML.trim();
                }
            }

            // Fix any gradeHtml that had '완료' or '최종'
            if (gradeHtml.includes('완료') || gradeHtml.includes('최종') || !gradeHtml) {
                let extractedGrade = '청 (Blue)';
                if (data.frozenHtml) {
                    if (data.frozenHtml.includes('value="청"') && data.frozenHtml.includes('checked')) extractedGrade = '청 (Blue)';
                    else if (data.frozenHtml.includes('value="적"') && data.frozenHtml.includes('checked')) extractedGrade = '적 (Red)';
                    else if (data.frozenHtml.includes('value="황"') && data.frozenHtml.includes('checked')) extractedGrade = '황 (Yellow)';
                    else if (data.frozenHtml.includes('value="녹"') && data.frozenHtml.includes('checked')) extractedGrade = '녹 (Green)';
                    else if (data.frozenHtml.includes('value="흑"') && data.frozenHtml.includes('checked')) extractedGrade = '흑 (Black)';
                }
                gradeHtml = getGradeBadgeLocal(extractedGrade);
            }

            // Clean title
            if (!title || title === '현장 조치 및 구조 작전 보고서') {
                title = '현장 구조 활동 보고서';
            }

            // Filter out any ghost reports where incNum, author, date are all missing/empty/dash
            const isGhost = (!incNum || incNum === '-') && (!author || author === '-') && (!date || date === '-');
            if (isGhost) {
                return; // Skip ghost row
            }

            tr.innerHTML = `
                <td>${incNum}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td>${date}</td>
                <td>${gradeHtml}</td>
            `;
            tr.dataset.frozen = data.frozenHtml || '';
            
            tr.addEventListener('click', () => {
                window.currentViewingRow = tr;
                if (readonlyBody) {
                    readonlyBody.innerHTML = tr.dataset.frozen;
                    readonlyBody.querySelectorAll('.frozen-val').forEach(el => {
                        el.style.minWidth = 'auto';
                        el.style.padding = '0 4px';
                    });
                    readonlyBody.querySelectorAll('.doc-field label, .doc-field-block label').forEach(lbl => {
                        lbl.style.minWidth = 'auto';
                    });
                }
                const editBtn = document.getElementById('edit-report-btn');
                if (editBtn) {
                    const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
                    editBtn.innerHTML = pencilSvg;
                    editBtn.title = '수정';
                }
                if (readonlyModal) readonlyModal.classList.remove('hidden');
            });
            
            logTableBody.appendChild(tr);
        });

        if (logTableBody.children.length === 0) {
            logTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-dim);">현재 등록된 사건 로그가 없습니다.</td></tr>';
        }
        
        // Immediately synchronize cleaned reports to localStorage
        saveReportsToLocal();
    } catch(e) {
        console.error('Failed to load reports', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReportsFromLocal);
} else {
    loadReportsFromLocal();
}

// -------------------------------------------------------------
// Team Status Dynamic Update Function
// -------------------------------------------------------------
function updateTeamStatus() {
    try {
        const teamStatusSection = document.getElementById('team-status');
        if (!teamStatusSection) return;
        
        const statCards = teamStatusSection.querySelectorAll('.stat-card .value');
        if (statCards.length < 4) return;
        
        const tsStatusText = statCards[1];
        const tsTotalText = statCards[2];
        const tsDeployText = statCards[3];
        
        const cards = document.querySelectorAll('#personnel .person-card');
        let totalMembers = cards.length;
        let deployableMembers = totalMembers;
        let minStat = 100;
        let mutatedNames = [];
        let injuredNames = [];

        cards.forEach(card => {
            const nameEl = card.querySelector('.person-header h4') || card.querySelector('.p-name');
            const name = nameEl ? nameEl.textContent.trim() : '대원';
            const inputs = card.querySelectorAll('.stat-val-input');
            let isCorrupted = false;
            let cardMin = 100;

            inputs.forEach(input => {
                const row = input.closest('.stat-row');
                const label = row ? (row.querySelector('label') || row.querySelector('.stat-label')) : null;
                const barFill = row ? row.querySelector('.stat-fill') : null;
                let valStr = input.value.trim().replace('%', '');

                if (valStr === '???') {
                    isCorrupted = true;
                    if (barFill) {
                        barFill.className = 'stat-fill bg-unknown';
                        barFill.style.width = '100%';
                    }
                    input.className = 'stat-val-input text-unknown';
                } else if (valStr === 'NaN') {
                    isCorrupted = true;
                    if (barFill) {
                        barFill.className = 'stat-fill bg-green';
                        barFill.style.width = '100%';
                    }
                    input.className = 'stat-val-input text-success';
                } else {
                    let val = parseInt(valStr);
                    if (isNaN(val)) val = 0;
                    if (val > 100) val = 100;
                    if (val < 0) val = 0;

                    let statClass = 'success';
                    if (val <= 10) statClass = 'red-black';
                    else if (val <= 30) statClass = 'red';
                    else if (val < 50) statClass = 'orange';
                    else if (val <= 70) statClass = 'yellow';

                    if (barFill) {
                        barFill.className = `stat-fill bg-${statClass}`;
                        barFill.style.width = val + '%';
                    }

                    input.className = 'stat-val-input';
                    if (statClass === 'red-black') input.classList.add('text-critical');
                    else if (statClass === 'red') input.classList.add('text-danger');
                    else if (statClass === 'orange') input.classList.add('text-orange');
                    else if (statClass === 'yellow') input.classList.add('text-warning');
                    else input.classList.add('text-success');

                    // James exception for mental stat
                    let effectiveVal = val;
                    if (name.includes('제임스') && label && label.textContent.includes('정신') && val === 50) {
                        effectiveVal = 70;
                    }

                    if (effectiveVal < cardMin) {
                        cardMin = effectiveVal;
                    }
                    if (effectiveVal < minStat) {
                        minStat = effectiveVal;
                    }
                }
            });

            if (isCorrupted) {
                mutatedNames.push(name);
                deployableMembers--;
            } else if (cardMin < 70) {
                injuredNames.push(name);
                deployableMembers--;
            }
        });

        tsStatusText.className = 'value';

        if (mutatedNames.length > 0) {
            tsStatusText.classList.add('text-danger');
            let text = mutatedNames.length === 1 ? mutatedNames[0] + ' 변질' : mutatedNames[0] + ' 외 ' + (mutatedNames.length - 1) + '명 변질';
            tsStatusText.textContent = text;
        } else if (injuredNames.length > 0) {
            tsStatusText.classList.add('text-warning');
            let text = injuredNames.length === 1 ? injuredNames[0] + ' 부상' : injuredNames[0] + ' 외 ' + (injuredNames.length - 1) + '명 부상';
            tsStatusText.textContent = text;
        } else if (minStat >= 70) {
            tsStatusText.classList.add('text-success');
            tsStatusText.textContent = '작전 가능';
        } else if (minStat >= 40) {
            tsStatusText.classList.add('text-warning');
            tsStatusText.textContent = '주의 요망';
        } else {
            tsStatusText.classList.add('text-danger');
            tsStatusText.textContent = '작전 불가';
        }

        if (tsTotalText) tsTotalText.textContent = totalMembers + '명';
        if (tsDeployText) tsDeployText.textContent = deployableMembers + '명';
    } catch(e) {
        console.error('updateTeamStatus error:', e);
    }
}

// -------------------------------------------------------------
// Team Leader Chat Logic (Interactive Script Mode)
// -------------------------------------------------------------
const CHAT_SCRIPT = [
    { sender: '[구조 2팀 한세경]', text: '오늘 대표님이 회식하신다는데.' },
    { sender: '[조사 2팀 유한별]', text: '네?' },
    { sender: '[조사 2팀 유한별]', text: '...회식이요?' },
    { sender: '[구조 2팀 한세경]', text: '아.' },
    { sender: '[구조 2팀 한세경]', text: '한별 씨는 모르겠구나. 종종 그러셔.' },
    { sender: '[구조 2팀 한세경]', text: '에휴.' },
    { sender: '[구조 2팀 한세경]', text: '뭔 회식이야 갑자기...' },
    { sender: '[연구 1팀 하선우]', text: '음... 연구팀은 일이 생겨서, 오늘 참석은 무리일 것 같네요^^' },
    { sender: '[구조 2팀 한세경]', text: "봐주는 거 없이 팀장들'만' 전원 참석이라고 하시는데." },
    { sender: '[조사 2팀 유한별]', text: '왜...일까요.' },
    { sender: '[조사 2팀 유한별]', text: '혹시 하 팀장님 뭐 하셨나요?' },
    { sender: '[연구 1팀 하선우]', text: '제가요?' },
    { sender: '[연구 1팀 하선우]', text: '아니 저 요즘 얌전히 살았다고요.' },
    { sender: '[구조 2팀 한세경]', text: '?' },
    { sender: '[구조 2팀 한세경]', text: '?????' },
    { sender: '[구조 2팀 한세경]', text: '...얌전히?' },
    { sender: '[구조 2팀 한세경]', text: '얼마 전에 너 때문에 우리 팀 전멸할 뻔했는데 얌전히???' },
    { sender: '[연구 1팀 하선우]', text: '그으거는-' },
    { sender: '[연구 1팀 하선우]', text: '조사 중에 착오가 있었다~' },
    { sender: '[조사 2팀 유한별]', text: '조사요?' },
    { sender: '[조사 2팀 유한별]', text: '저희는 꼼꼼하게 목숨 걸고 잘 다녀왔습니다만.' },
    { sender: '[연구 1팀 하선우]', text: '종종 조사 과정에 착오가 생기는 경우가 있는 거죠.' },
    { sender: '[연구 1팀 하선우]', text: '유 팀장님은 모험심이 없으시잖아요^^' },
    { sender: '[구조 2팀 한세경]', text: '효율과 안전을 추구한다는 거야.' },
    { sender: '[구조 2팀 한세경]', text: '싸이코야.' },
    { sender: '[조사 2팀 유한별]', text: '제 말이요.' },
    { sender: '[조사 2팀 유한별]', text: '감사합니다, 한 팀장님.' },
    { sender: '[연구 1팀 하선우]', text: '아무튼.' },
    { sender: '[연구 1팀 하선우]', text: '회식을 피할 방법을 생각해봤는데요.' },
    { sender: '[조사 2팀 유한별]', text: '네.' },
    { sender: '[구조 2팀 한세경]', text: '뭔데.' },
    { sender: '[연구 1팀 하선우]', text: '재단 건물 내에 이상 현상을 하나 발생시키는 겁니다.' },
    { sender: '[연구 1팀 하선우]', text: '439같은?' },
    { sender: '[조사 2팀 유한별]', text: '미치셨어요?' },
    { sender: '[구조 2팀 한세경]', text: '이 또라이가 뭘 잘못 쳐먹었나' },
    { sender: '[구조 2팀 한세경]', text: '돌았어? 아주 세상이 빙빙 돌지?' },
    { sender: '[연구 1팀 하선우]', text: '왜요.' },
    { sender: '[구조 2팀 한세경]', text: '왜긴 왜야. 몰라서 묻냐?' },
    { sender: '[구조 2팀 한세경]', text: '어떤 미친 새끼가 인류를 이상체로부터 지키는 조직에서 회식 하나를 피하겠자고 이상 현상을 발생시켜?' },
    { sender: '[구조 2팀 한세경]', text: '네가 정녕 미쳤지?' },
    { sender: '[구조 2팀 한세경]', text: '아니 그냥 원래도 미쳐있긴 하니까.' },
    { sender: '[구조 2팀 한세경]', text: '사상자는, 변질자는.' },
    { sender: '[구조 2팀 한세경]', text: '니가 감당할거냐??' },
    { sender: '[연구 1팀 하선우]', text: '아, 그럼요. 이 하선우가 그렇게 멍청한 짓을 저지르겠습니까.' },
    { sender: '[조사 2팀 유한별]', text: '네.' },
    { sender: '[조사 2팀 유한별]', text: '정확히는 멍청한보다는 개 썅 미친 짓이지만요.' },
    { sender: '[연구 1팀 하선우]', text: '아, 좀 상처받을지도요.' },
    { sender: '[구조 2팀 한세경]', text: '넌 좀 받아라.' },
    { sender: '[연구 1팀 하선우]', text: '큼.' },
    { sender: '[연구 1팀 하선우]', text: '아무튼, 439를 117를 통해서 복제를 거치고 약화된 상태의 439를 발동시키는거죠.' },
    { sender: '[연구 1팀 하선우]', text: '그럼, 사상자도 변질자도 발생하지 않겠죠? 439 자체도 등급도 청이잖아요?' },
    { sender: '[조사 2팀 유한별]', text: '어느 정도로요?' },
    { sender: '[구조 2팀 한세경]', text: '한별 씨.' },
    { sender: '[조사 2팀 유한별]', text: '죄송합니다.' },
    { sender: '[연구 1팀 하선우]', text: '아, 관심을 주시니까 기쁘게 마저 말하자면요~' },
    { sender: '[연구 1팀 하선우]', text: '물리적인 피해는 없도록 하고요.' },
    { sender: '[연구 1팀 하선우]', text: '정신 변질이 발생하더라도 자가 회복 가능한 수준으로 조정하겠습니다.' },
    { sender: '[연구 1팀 하선우]', text: '범위는 본관 일부.' },
    { sender: '[연구 1팀 하선우]', text: '지속 시간은 길어도 한 시간 정도.' },
    { sender: '[조사 2팀 유한별]', text: '한 시간.' },
    { sender: '[조사 2팀 유한별]', text: '회식이 7시니까 충분하겠네요.' },
    { sender: '[구조 2팀 한세경]', text: '너 지금 진짜 진지하게 듣고 있지.' },
    { sender: '[조사 2팀 유한별]', text: '...조금요.' },
    { sender: '[연구 1팀 하선우]', text: '게다가 제가 현장에서 직접 관리하면—' },
    { sender: '[처리 2팀 레이븐]', text: '처리팀에서 잔여 현상 정리도 가능합니다.' },
    { sender: '[구조 2팀 한세경]', text: '레이븐, 언제부터 보고 있었어.' },
    { sender: '[처리 2팀 레이븐]', text: '조금 전입니다.' },
    { sender: '[처리 2팀 레이븐]', text: '대화의 흐름을 보니 필요한 것 같아서요.' },
    { sender: '[연구 1팀 하선우]', text: '보셨죠?' },
    { sender: '[연구 1팀 하선우]', text: '아주 완벽한 계획입니다.' },
    { sender: '[조사 2팀 유한별]', text: '생각보다 괜찮은데요.' },
    { sender: '[구조 2팀 한세경]', text: '안 괜찮아.' },
    { sender: '[처리 2팀 레이븐]', text: '개인적으로는 상당히 괜찮아 보입니다.' },
    { sender: '[구조 2팀 한세경]', text: '레이븐까지 왜 그래.' },
    { sender: '[연구 1팀 하선우]', text: '그럼 지금 발생시키겠습니다.' },
    { sender: '[구조 2팀 한세경]', text: '안 돼.' },
    { sender: '[연구 1팀 하선우]', text: '아니 근데 솔직히 대표님이랑 회식이 더 이상 현상 아닙니까.' },
    { sender: '[조사 2팀 유한별]', text: '동감입니다.' },
    { sender: '[구조 2팀 한세경]', text: '...그렇게 말하면 할 말이 없는데...' },
    { sender: '[구조 2팀 한세경]', text: '하...' },
    { sender: '[구조 2팀 한세경]', text: '그래도 안 돼.' },
    { sender: '[연구 1팀 하선우]', text: '에라이.' },
    { sender: '[구조 2팀 한세경]', text: '계산이 아무리 완벽하다고 해도 그건 어디까지나 시뮬레이션이야.' },
    { sender: '[구조 2팀 한세경]', text: '변수는 언제든지 발생해. 너희도 그걸 알 텐데.' },
    { sender: '[구조 2팀 한세경]', text: '그리고 그 변수에 제일 먼저 휘말리는 건 현장에 있는 사람들이고.' },
    { sender: '[연구 1팀 하선우]', text: '...' },
    { sender: '[조사 2팀 유한별]', text: '맞는 말씀이긴 하네요.' },
    { sender: '[처리 2팀 레이븐]', text: '동의합니다.' },
    { sender: '[연구 1팀 하선우]', text: '아~ 회식 한 번 피하기 참 어렵네요.' },
    { sender: '[구조 2팀 한세경]', text: '그러니까 그냥 가. 두 시간만 참지 뭐.' },
    { sender: '[조사 2팀 유한별]', text: '...네.' },
    { sender: '[처리 2팀 레이븐]', text: '알겠습니다.' },
    { sender: '[연구 1팀 하선우]', text: '아쉽다 정말.' },
    { sender: '[구조 2팀 한세경]', text: '뭘 아쉬워. 뭘. 어휴... 정말.' }
];

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatAttachBtn = document.getElementById('chat-attach-btn');
const chatFileInput = document.getElementById('chat-file-input');

let isBotReplying = false;

function getSenderColor(sender) {
    if (sender.includes('구조') || sender.includes('한세경')) return '#60a5fa'; // 구조팀 (파란색)
    if (sender.includes('조사') || sender.includes('유한별')) return '#facc15'; // 조사팀 (노란색)
    if (sender.includes('연구') || sender.includes('하선우')) return '#f87171'; // 연구팀 (붉은색)
    if (sender.includes('처리') || sender.includes('레이븐')) return '#4ade80'; // 처리팀 (초록색)
    return '#94a3b8';
}

let chatStartTime = new Date('2022-06-07T04:12:00'); // Fixed start time
const realStartMs = Date.now();
let chatElapsedMs = 0;

function getTimeString() {
    const simulated = new Date(chatStartTime.getTime() + chatElapsedMs);
    const hh = String(simulated.getHours()).padStart(2, '0');
    const mm = String(simulated.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

function getChatMessageTime(item) {
    if (item && item.text === '아, 그럼요. 이 하선우가 그렇게 멍청한 짓을 저지르겠습니까.') return '04:13';
    if (item && item.text === '에라이.') return '04:14';
    return getTimeString();
}

function formatChatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function appendChatMessage(sender, text, timeStr, attachments = [], shouldSave = true) {
    if (!chatMessages) return;

    const lastMsg = chatMessages.lastElementChild;
    const isConsecutive = lastMsg && lastMsg.classList && lastMsg.classList.contains('chat-msg-item') && lastMsg.dataset.sender === sender;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg-item';
    msgDiv.dataset.sender = sender;
    msgDiv.style.display = 'flex';
    msgDiv.style.flexDirection = 'column';
    msgDiv.style.gap = '3px';
    msgDiv.style.maxWidth = '84%';
    msgDiv.style.marginTop = isConsecutive ? '2px' : '8px';
    
    const isMe = sender.includes('한세경');
    if (isMe) {
        msgDiv.style.alignSelf = 'flex-end';
        msgDiv.style.alignItems = 'flex-end';
    } else {
        msgDiv.style.alignSelf = 'flex-start';
        msgDiv.style.alignItems = 'flex-start';
    }

    if (!isConsecutive) {
        const infoDiv = document.createElement('div');
        infoDiv.style.display = 'flex';
        infoDiv.style.alignItems = 'center';
        infoDiv.style.gap = '6px';
        infoDiv.style.fontSize = '11px';
        infoDiv.style.color = '#888';

        const senderColor = getSenderColor(sender);
        if (isMe) {
            infoDiv.innerHTML = `<span style="font-size:10px; color:#64748b;">${timeStr}</span><span style="color:${senderColor}; font-weight:bold;">${sender}</span>`;
        } else {
            infoDiv.innerHTML = `<span style="color:${senderColor}; font-weight:bold;">${sender}</span><span style="font-size:10px; color:#64748b;">${timeStr}</span>`;
        }
        msgDiv.appendChild(infoDiv);
    }

    const bubble = document.createElement('div');
    bubble.style.padding = '8px 12px';
    bubble.style.borderRadius = isMe 
        ? (isConsecutive ? '10px 4px 4px 10px' : '10px 10px 2px 10px') 
        : (isConsecutive ? '4px 10px 10px 4px' : '10px 10px 10px 2px');
    bubble.style.background = isMe ? 'rgba(37, 99, 235, 0.35)' : 'rgba(255, 255, 255, 0.07)';
    bubble.style.border = isMe ? '1px solid rgba(59, 130, 246, 0.45)' : '1px solid #2a313d';
    bubble.style.color = '#f8fafc';
    bubble.style.fontSize = '12.5px';
    bubble.style.wordBreak = 'break-word';
    bubble.style.lineHeight = '1.45';

    if (text) {
        const textEl = document.createElement('div');
        textEl.textContent = text;
        bubble.appendChild(textEl);
    }

    if (Array.isArray(attachments) && attachments.length > 0) {
        attachments.forEach(att => {
            if (att.type === 'image') {
                const imgWrap = document.createElement('div');
                imgWrap.style.marginTop = text ? '6px' : '0';
                imgWrap.style.borderRadius = '6px';
                imgWrap.style.overflow = 'hidden';
                imgWrap.style.border = '1px solid rgba(255,255,255,0.1)';
                imgWrap.innerHTML = `<img src="${att.data}" alt="${att.name}" style="width:100%; max-height:220px; object-fit:contain; cursor:pointer; display:block;" onclick="window.open('${att.data}', '_blank')">`;
                bubble.appendChild(imgWrap);
            } else if (att.type === 'video') {
                const vidWrap = document.createElement('div');
                vidWrap.style.marginTop = text ? '6px' : '0';
                vidWrap.style.borderRadius = '6px';
                vidWrap.style.overflow = 'hidden';
                vidWrap.style.border = '1px solid rgba(255,255,255,0.1)';
                vidWrap.innerHTML = `<video src="${att.data}" controls style="width:100%; max-height:220px; display:block;"></video>`;
                bubble.appendChild(vidWrap);
            } else {
                const fileWrap = document.createElement('a');
                fileWrap.href = att.data;
                fileWrap.download = att.name;
                fileWrap.style.display = 'flex';
                fileWrap.style.alignItems = 'center';
                fileWrap.style.gap = '8px';
                fileWrap.style.padding = '8px 10px';
                fileWrap.style.background = 'rgba(0,0,0,0.35)';
                fileWrap.style.borderRadius = '6px';
                fileWrap.style.marginTop = text ? '6px' : '0';
                fileWrap.style.border = '1px solid rgba(255,255,255,0.1)';
                fileWrap.style.textDecoration = 'none';
                fileWrap.style.color = '#fff';
                fileWrap.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:bold; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#e2e8f0;">${att.name}</div>
                        <div style="font-size:10px; color:#94a3b8;">${formatChatFileSize(att.size)}</div>
                    </div>
                    <span style="font-size:11px; color:#60a5fa; white-space:nowrap; font-weight:bold;">받기</span>
                `;
                bubble.appendChild(fileWrap);
            }
        });
    }

    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (shouldSave) {
        const saved = localStorage.getItem('border_leader_chat_history');
        let list = [];
        if (saved) {
            try { list = JSON.parse(saved); } catch(e) {}
        }
        list.push({ sender, text, time: timeStr, attachments });
        try {
            localStorage.setItem('border_leader_chat_history', JSON.stringify(list));
        } catch(e) {
            console.warn('Storage quota limit reached for attachments', e);
        }
    }
}

function getScriptIndex() {
    const idx = localStorage.getItem('border_script_chat_index');
    return idx !== null ? parseInt(idx, 10) : 0;
}

function setScriptIndex(idx) {
    localStorage.setItem('border_script_chat_index', idx);
}

let scriptTypedCount = 0;

function getNextScriptLine() {
    const idx = getScriptIndex();
    if (idx < CHAT_SCRIPT.length && CHAT_SCRIPT[idx].sender.includes('한세경')) {
        return CHAT_SCRIPT[idx].text;
    }
    return null;
}

function onUserType(direction = 1) {
    const targetLine = getNextScriptLine();
    if (!targetLine) return;

    if (direction < 0) {
        scriptTypedCount = Math.max(0, scriptTypedCount - 1);
    } else {
        scriptTypedCount = Math.min(targetLine.length, scriptTypedCount + 1);
    }
    if (chatInput) {
        chatInput.value = targetLine.slice(0, scriptTypedCount);
    }
}

function calculateMessageDelay(text) {
    const len = text ? text.length : 8;
    // Slight breathing room between incoming team-leader messages.
    // Keep typing feel, but slow the overall pace enough to read comfortably.
    const calculated = 560 + (len * 24) + Math.floor(Math.random() * 140);
    // Min 650ms, Max 2200ms (2.2초 상한)
    const delay = Math.min(2200, Math.max(650, calculated));
    // Accumulate simulated elapsed time
    chatElapsedMs += delay;
    return delay;
}

function triggerNextNpcMessages() {
    let curIndex = getScriptIndex();
    if (curIndex >= CHAT_SCRIPT.length) {
        isBotReplying = false;
        scriptTypedCount = 0;
        if (chatInput) {
            chatInput.placeholder = "메시지 입력...";
            chatInput.focus();
        }
        // Ensure total simulated time reaches 4 minutes (240000 ms)
        const TARGET_TOTAL_MS = 4 * 60 * 1000; // 240000
        const remaining = TARGET_TOTAL_MS - chatElapsedMs;
        if (remaining > 0) {
            setTimeout(() => {
                // Conversation ends after remaining time.
            }, remaining);
        }
        return;
    }

    const nextItem = CHAT_SCRIPT[curIndex];
    if (!nextItem.sender.includes('한세경')) {
        isBotReplying = true;
        if (chatInput) {
            chatInput.placeholder = `${nextItem.sender.replace(/[\[\]]/g, '')} 입력 중...`;
        }
        const delay = calculateMessageDelay(nextItem.text);
        setTimeout(() => {
            const timeStr = getChatMessageTime(nextItem);
            appendChatMessage(nextItem.sender, nextItem.text, timeStr, [], true);
            curIndex++;
            setScriptIndex(curIndex);

            if (curIndex < CHAT_SCRIPT.length && !CHAT_SCRIPT[curIndex].sender.includes('한세경')) {
                triggerNextNpcMessages();
            } else if (curIndex >= CHAT_SCRIPT.length) {
                // All script items have been processed.
                isBotReplying = false;
                scriptTypedCount = 0;
                if (chatInput) {
                    chatInput.placeholder = "메시지 입력...";
                    chatInput.focus();
                }
                // If simulated elapsed time is less than 18 minutes, wait the remaining time.
                const TARGET_TOTAL_MS = 18 * 60 * 1000; // 1080000 ms
                const remaining = TARGET_TOTAL_MS - chatElapsedMs;
                if (remaining > 0) {
                    setTimeout(() => {
                        // Advance simulated clock
                        chatElapsedMs += remaining;
                        // Show final system message with updated time
                        const finalTimeStr = getTimeString();
                        appendChatMessage('[시스템]', '대화가 종료되었습니다.', finalTimeStr, [], false);
                    }, remaining);
                }
                return;
            } else {
                isBotReplying = false;
                scriptTypedCount = 0;
                if (chatInput) {
                    chatInput.placeholder = "메시지 입력...";
                    chatInput.value = '';
                    chatInput.focus();
                }
            }
        }, delay);
    } else {
        isBotReplying = false;
        scriptTypedCount = 0;
        if (chatInput) {
            chatInput.placeholder = "메시지 입력...";
            chatInput.value = '';
            chatInput.focus();
        }
    }
}

function advanceChatScript() {
    if (isBotReplying) return false;
    let curIndex = getScriptIndex();
    if (curIndex >= CHAT_SCRIPT.length) return false;

    const curItem = CHAT_SCRIPT[curIndex];
    const timeStr = getTimeString();
    appendChatMessage(curItem.sender, curItem.text, timeStr, [], true);
    curIndex++;
    setScriptIndex(curIndex);
    scriptTypedCount = 0;

    triggerNextNpcMessages();
    return true;
}

function handleSend() {
    if (isBotReplying) return;
    const targetLine = getNextScriptLine();
    if (targetLine) {
        scriptTypedCount = 0;
        if (chatInput) chatInput.value = '';
        advanceChatScript();
    } else {
        const text = chatInput ? chatInput.value.trim() : '';
        if (text) {
            if (chatInput) chatInput.value = '';
            scriptTypedCount = 0;
            const timeStr = getTimeString();
            appendChatMessage('[구조 2팀 한세경]', text, timeStr, [], true);
        }
    }
}

function loadLeaderChat() {
    if (!chatMessages) return;
    isBotReplying = false;
    scriptTypedCount = 0;

    // Reset storage version to ensure fresh sync
    if (!localStorage.getItem('border_chat_reset_v10')) {
        localStorage.removeItem('border_leader_chat_history');
        localStorage.removeItem('border_script_chat_index');
        localStorage.setItem('border_chat_reset_v10', 'true');
    }
    chatMessages.innerHTML = `
        <div style="text-align: center; margin: 6px 0;">
            <span style="font-size: 11px; color: #8892b0; background: rgba(255,255,255,0.04); padding: 4px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); display: inline-block;">
                2026년 9월 10일 목요일
            </span>
        </div>
    `;
    const saved = localStorage.getItem('border_leader_chat_history');
    if (saved) {
        try {
            const msgs = JSON.parse(saved);
            if (Array.isArray(msgs)) {
                msgs.forEach(m => appendChatMessage(m.sender, m.text, m.time, m.attachments || [], false));
            }
        } catch(e) {
            console.error('Failed to load chat history', e);
        }
    }

    if (chatInput) {
        chatInput.value = '';
        chatInput.placeholder = "메시지 입력...";
        chatInput.focus();
    }
}

if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
            return;
        }

        if (isBotReplying) {
            e.preventDefault();
            return;
        }

        const targetLine = getNextScriptLine();
        if (!targetLine) return; // Script finished -> normal typing

        if (e.key === 'Backspace') {
            e.preventDefault();
            onUserType(-1);
            return;
        }

        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
            return;
        }

        e.preventDefault();
        onUserType(1);
    });

    chatInput.addEventListener('input', (e) => {
        if (isBotReplying) {
            chatInput.value = '';
            return;
        }
        const targetLine = getNextScriptLine();
        if (!targetLine) return;

        if (chatInput.value !== targetLine.slice(0, scriptTypedCount)) {
            if (e.inputType && e.inputType.startsWith('delete')) {
                onUserType(-1);
            } else {
                onUserType(1);
            }
        }
    });
}

if (chatAttachBtn && chatFileInput) {
    chatAttachBtn.addEventListener('click', () => {
        chatFileInput.click();
    });

    chatFileInput.addEventListener('change', () => {
        const files = Array.from(chatFileInput.files);
        if (!files.length) return;

        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let type = 'file';
                    if (file.type.startsWith('image/')) type = 'image';
                    else if (file.type.startsWith('video/')) type = 'video';
                    resolve({
                        type,
                        name: file.name,
                        size: file.size,
                        data: e.target.result
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(attachments => {
            const timeStr = getTimeString();
            const text = chatInput ? chatInput.value.trim() : '';
            appendChatMessage('[구조 2팀 한세경]', text, timeStr, attachments, true);
            if (chatInput) chatInput.value = '';
            chatFileInput.value = '';
        });
    });
}

function resetChatState() {
    if (confirm('대화 내역을 초기화하고 처음부터 다시 시작하시겠습니까?')) {
        localStorage.removeItem('border_leader_chat_history');
        localStorage.removeItem('border_script_chat_index');
        isBotReplying = false;
        scriptTypedCount = 0;
        
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div style="text-align: center; margin: 6px 0;">
                    <span style="font-size: 11px; color: #8892b0; background: rgba(255,255,255,0.04); padding: 4px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); display: inline-block;">
                        2026년 9월 10일 목요일
                    </span>
                </div>
            `;
        }
        if (chatInput) {
            chatInput.value = '';
            chatInput.placeholder = "메시지 입력...";
            chatInput.focus();
        }
        localStorage.setItem('border_chat_reset_trigger', Date.now().toString());
    }
}

const chatTitleResetBtn = document.getElementById('chat-title-reset-btn');
if (chatTitleResetBtn) {
    chatTitleResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetChatState();
    });
}

if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSend();
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'border_chat_reset_trigger') {
        isBotReplying = false;
        scriptTypedCount = 0;
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div style="text-align: center; margin: 6px 0;">
                    <span style="font-size: 11px; color: #8892b0; background: rgba(255,255,255,0.04); padding: 4px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); display: inline-block;">
                        2026년 9월 10일 목요일
                    </span>
                </div>
            `;
        }
        if (chatInput) {
            chatInput.value = '';
            chatInput.placeholder = "메시지 입력...";
        }
    } else if (e.key === 'border_leader_chat_history') {
        const saved = localStorage.getItem('border_leader_chat_history');
        if (saved && chatMessages) {
            chatMessages.innerHTML = `
                <div style="text-align: center; margin: 6px 0;">
                    <span style="font-size: 11px; color: #8892b0; background: rgba(255,255,255,0.04); padding: 4px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); display: inline-block;">
                        2026년 9월 10일 목요일
                    </span>
                </div>
            `;
            try {
                const msgs = JSON.parse(saved);
                if (Array.isArray(msgs)) {
                    msgs.forEach(m => appendChatMessage(m.sender, m.text, m.time, m.attachments || [], false));
                }
            } catch(e) {}
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLeaderChat);
} else {
    loadLeaderChat();
}
