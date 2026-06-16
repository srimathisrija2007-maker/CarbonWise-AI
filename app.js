// ==========================================
// CARBONWISE AI - APPLICATION LOGIC & STATE
// ==========================================

// 1. Initial State
const APP_STATE = {
    profile: {
        username: "Eco Warrior",
        level: 4,
        xp: 450,
        streak: 5,
        streakActive: true
    },
    budget: {
        allowed: 150.0, // kg CO2e per month
        used: 92.0,
        remaining: 58.0
    },
    sustainabilityScore: 85,
    language: "en",
    voiceEnabled: false,
    contrastMode: false,
    
    // Baseline log entries for initial view
    logs: [
        { id: "log-1", category: "transport", value: 120, unit: "km", subtype: "car-gasoline", co2: 21.6, date: "2026-06-12" },
        { id: "log-2", category: "energy", value: 150, unit: "kWh", subtype: "electricity", co2: 58.5, date: "2026-06-13" },
        { id: "log-3", category: "food", value: 2, unit: "days", subtype: "meat-avg", co2: 9.0, date: "2026-06-14" },
        { id: "log-4", category: "digital", value: 10, unit: "hours", subtype: "streaming", co2: 0.2, date: "2026-06-15" },
        { id: "log-5", category: "water", value: 1500, unit: "liters", subtype: "domestic", co2: 0.45, date: "2026-06-15" },
        { id: "log-6", category: "waste", value: 5, unit: "kg", subtype: "mixed", co2: 2.25, date: "2026-06-16" }
    ],
    
    badges: [
        { id: "badge-warrior", name: "Eco Warrior", desc: "Signed up and completed onboarding", icon: "shield", earned: true },
        { id: "badge-transit", name: "Transit Hero", desc: "Log 3 public transit trips", icon: "bus", earned: true },
        { id: "badge-zero", name: "Zero Waste Hero", desc: "No waste logged for 3 consecutive days", icon: "recycle", earned: false },
        { id: "badge-chef", name: "Vegan Explorer", desc: "Eat vegan for 5 days in a row", icon: "apple", earned: false },
    ],

    activeTwinScenario: "current",
    activeDocTab: "arch-overview"
};

// 2. Emission Factors (kg CO2e per unit)
const EMISSION_FACTORS = {
    transport: {
        "car-gasoline": 0.18, // per km
        "car-diesel": 0.17, // per km
        "car-electric": 0.05, // per km
        "bus": 0.06, // per km
        "train": 0.03, // per km
        "bicycle": 0.00 // per km
    },
    energy: {
        "electricity": 0.39, // per kWh (standard grid average)
        "gas": 0.20 // per kWh
    },
    food: {
        "meat-heavy": 7.2, // per day
        "meat-avg": 4.5, // per day
        "vegetarian": 2.0, // per day
        "vegan": 1.2 // per day
    },
    shopping: 0.22, // per USD spent
    waste: 0.45, // per kg
    water: 0.0003, // per liter
    digital: 0.02 // per hour of streaming
};

// 3. Multi-Language Dictionaries
const TRANSLATIONS = {
    en: {
        "tagline": "Small Actions. Smarter Choices. Greener Future.",
        "nav-dashboard": "Dashboard",
        "nav-twin": "AI Carbon Twin",
        "nav-coach": "AI Climate Coach",
        "nav-ocr": "OCR Bill Analyzer",
        "nav-rewards": "Rewards & Habits",
        "nav-arch": "System Architecture",
        "title-dashboard": "Climate Dashboard",
        "gdpr-purge": "Purge Data",
        "card-score-title": "Sustainability Score",
        "card-budget-title": "Monthly Carbon Budget",
        "card-breakdown-title": "Emission Breakdown (kg CO₂e)",
        "card-logger-title": "Quick Footprint Logger",
        "label-category": "Category",
        "btn-log": "Log Emission Entry"
    },
    es: {
        "tagline": "Pequeñas Acciones. Opciones Inteligentes. Futuro Verde.",
        "nav-dashboard": "Panel de Control",
        "nav-twin": "Gemelo de Carbono",
        "nav-coach": "Entrenador Climático",
        "nav-ocr": "Analizador OCR",
        "nav-rewards": "Logros y Hábitos",
        "nav-arch": "Arquitectura del Sistema",
        "title-dashboard": "Panel Climático",
        "gdpr-purge": "Purgar Datos",
        "card-score-title": "Puntaje de Sostenibilidad",
        "card-budget-title": "Presupuesto de Carbono",
        "card-breakdown-title": "Desglose de Emisiones (kg CO₂e)",
        "card-logger-title": "Registrador Rápido de Huella",
        "label-category": "Categoría",
        "btn-log": "Registrar Emisión"
    },
    fr: {
        "tagline": "Petites Actions. Choix Plus Intelligents. Futur Plus Vert.",
        "nav-dashboard": "Tableau de Bord",
        "nav-twin": "Jumeau Numérique",
        "nav-coach": "Coach Climatique",
        "nav-ocr": "Analyseur OCR",
        "nav-rewards": "Récompenses & Habitudes",
        "nav-arch": "Architecture Système",
        "title-dashboard": "Tableau Climatique",
        "gdpr-purge": "Purger Données",
        "card-score-title": "Score de Durabilité",
        "card-budget-title": "Budget Carbone Mensuel",
        "card-breakdown-title": "Répartition des Émissions (kg CO₂e)",
        "card-logger-title": "Enregistreur de Carbone",
        "label-category": "Catégorie",
        "btn-log": "Enregistrer Empreinte"
    },
    de: {
        "tagline": "Kleine Taten. Kluge Entscheidungen. Grüne Zukunft.",
        "nav-dashboard": "Dashboard",
        "nav-twin": "Kohlenstoff-Zwilling",
        "nav-coach": "AI Klima-Coach",
        "nav-ocr": "OCR Rechnungsprüfer",
        "nav-rewards": "Erfolge & Gewohnheiten",
        "nav-arch": "Systemarchitektur",
        "title-dashboard": "Klima-Dashboard",
        "gdpr-purge": "Daten Löschen",
        "card-score-title": "Nachhaltigkeits-Score",
        "card-budget-title": "Monatliches CO₂-Budget",
        "card-breakdown-title": "Emissionsverteilung (kg CO₂e)",
        "card-logger-title": "Schnell-Protokollierer",
        "label-category": "Kategorie",
        "btn-log": "Eintrag Speichern"
    }
};

// Global variables for Chart and simulated state
let emissionChart = null;
let currentMockOCRDoc = null;

// ==========================================
// 4. MAIN CONTROLLER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Load state from local storage if existing
    const cachedState = localStorage.getItem("carbonwise_state");
    if (cachedState) {
        Object.assign(APP_STATE, JSON.parse(cachedState));
    }
    
    // Setup Navigation Handlers
    setupNavigation();
    
    // Setup Logger Event listeners
    setupLoggerForm();
    
    // Setup Twin Controls
    setupTwinSimulator();
    
    // Setup Climate Coach
    setupClimateCoach();
    
    // Setup OCR Module
    setupOCRAnalyzer();
    
    // Setup System Settings (Contrast, Translations, GDPR Purge)
    setupSettings();

    // Render Initial UI State
    updateUI();
});

// Navigation views switching
function setupNavigation() {
    const navItems = document.querySelectorAll(".menu-item");
    const panels = document.querySelectorAll(".view-panel");
    const pageTitle = document.getElementById("page-title");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const viewName = item.getAttribute("data-view");
            
            navItems.forEach(n => n.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            
            item.classList.add("active");
            document.getElementById(`view-${viewName}`).classList.add("active");
            
            // Translate header title dynamically
            if (viewName === "dashboard") {
                pageTitle.textContent = TRANSLATIONS[APP_STATE.language]["title-dashboard"];
                pageTitle.setAttribute("data-i18n", "title-dashboard");
            } else {
                pageTitle.removeAttribute("data-i18n");
                pageTitle.textContent = item.querySelector("span").textContent;
            }
            
            // Re-render chart on tab switch to avoid sizing issues
            if (viewName === "dashboard" && emissionChart) {
                emissionChart.resize();
            }
        });
    });

    // Architecture section internal tabs
    const docTabs = document.querySelectorAll(".doc-tab-btn");
    const docPanels = document.querySelectorAll(".doc-tab-panel");
    
    docTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            docTabs.forEach(t => t.classList.remove("active"));
            docPanels.forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            const targetPanel = tab.getAttribute("data-tab");
            document.getElementById(`tab-${targetPanel}`).classList.add("active");
            APP_STATE.activeDocTab = targetPanel;
            saveStateToStorage();
        });
    });
}

// Quick footprint logger
function setupLoggerForm() {
    const categorySelect = document.getElementById("log-category");
    const valInput = document.getElementById("log-value");
    const valLabel = document.getElementById("log-value-label");
    const transportSub = document.getElementById("transport-subtypes");
    const foodSub = document.getElementById("food-subtypes");
    const calculatorForm = document.getElementById("calculator-form");

    // Dynamic labels based on categories selected
    categorySelect.addEventListener("change", (e) => {
        const val = e.target.value;
        transportSub.classList.add("hidden");
        foodSub.classList.add("hidden");
        
        switch (val) {
            case "transport":
                valLabel.textContent = "Distance (km)";
                transportSub.classList.remove("hidden");
                valInput.placeholder = "e.g. 25";
                break;
            case "energy":
                valLabel.textContent = "Electricity (kWh)";
                valInput.placeholder = "e.g. 120";
                break;
            case "food":
                valLabel.textContent = "Dietary Duration (Days)";
                foodSub.classList.remove("hidden");
                valInput.placeholder = "e.g. 5";
                break;
            case "shopping":
                valLabel.textContent = "Expense Amount (USD)";
                valInput.placeholder = "e.g. 50";
                break;
            case "waste":
                valLabel.textContent = "Waste Weight (kg)";
                valInput.placeholder = "e.g. 10";
                break;
            case "water":
                valLabel.textContent = "Water volume (Liters)";
                valInput.placeholder = "e.g. 200";
                break;
            case "digital":
                valLabel.textContent = "Streaming/Computing (Hours)";
                valInput.placeholder = "e.g. 4";
                break;
        }
    });

    calculatorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const category = categorySelect.value;
        const val = parseFloat(valInput.value);
        let subtype = "default";
        let co2Factor = 0;
        let unitText = "";

        if (isNaN(val) || val <= 0) return;

        if (category === "transport") {
            subtype = document.getElementById("transport-mode").value;
            co2Factor = EMISSION_FACTORS.transport[subtype];
            unitText = "km";
        } else if (category === "energy") {
            subtype = "electricity";
            co2Factor = EMISSION_FACTORS.energy.electricity;
            unitText = "kWh";
        } else if (category === "food") {
            subtype = document.getElementById("food-diet").value;
            co2Factor = EMISSION_FACTORS.food[subtype];
            unitText = "days";
        } else if (category === "shopping") {
            co2Factor = EMISSION_FACTORS.shopping;
            unitText = "USD";
        } else if (category === "waste") {
            co2Factor = EMISSION_FACTORS.waste;
            unitText = "kg";
        } else if (category === "water") {
            co2Factor = EMISSION_FACTORS.water;
            unitText = "L";
        } else if (category === "digital") {
            co2Factor = EMISSION_FACTORS.digital;
            unitText = "hrs";
        }

        const calculatedCO2 = parseFloat((val * co2Factor).toFixed(2));
        
        // Push to logs
        const newLog = {
            id: `log-${Date.now()}`,
            category: category,
            value: val,
            unit: unitText,
            subtype: subtype,
            co2: calculatedCO2,
            date: new Date().toISOString().split("T")[0]
        };

        APP_STATE.logs.unshift(newLog);
        
        // Trigger behavioral nudges / rewards
        awardXP(15);
        triggerStreakProgress();

        // Save & Refresh UI
        saveStateToStorage();
        updateUI();
        
        // Reset input field
        valInput.value = "";
        
        // Create confirmation pop-up or announcement
        speakText(`Successfully logged ${calculatedCO2} kilograms of Carbon dioxide equivalent to your ledger.`);
    });
}

// Twin digital replica simulator
function setupTwinSimulator() {
    const scenarioBtns = document.querySelectorAll(".scenario-btn");
    
    scenarioBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            scenarioBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const scenario = btn.getAttribute("data-scenario");
            APP_STATE.activeTwinScenario = scenario;
            
            saveStateToStorage();
            updateTwinProjections();
        });
    });
}

// AI coach chat responses
function setupClimateCoach() {
    const msgInput = document.getElementById("coach-message-input");
    const sendBtn = document.getElementById("coach-send-btn");
    const micBtn = document.getElementById("coach-mic-btn");
    const chatHistory = document.getElementById("coach-chat-history");
    const promptChips = document.querySelectorAll(".suggest-prompt-chip");

    sendBtn.addEventListener("click", handleUserMessage);
    msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleUserMessage();
    });

    // Mic Button Mock
    micBtn.addEventListener("click", () => {
        micBtn.classList.toggle("text-danger");
        if (micBtn.classList.contains("text-danger")) {
            speakText("Listening to your environment query...");
            msgInput.value = "How can I reduce my transportation footprint?";
            setTimeout(() => {
                micBtn.classList.remove("text-danger");
                handleUserMessage();
            }, 1800);
        }
    });

    // Prompt Chips clicking
    promptChips.forEach(chip => {
        chip.addEventListener("click", () => {
            msgInput.value = chip.textContent.replace(/"/g, "");
            handleUserMessage();
        });
    });

    function handleUserMessage() {
        const text = msgInput.value.trim();
        if (!text) return;

        // Render User Bubble
        appendChatBubble(text, "user");
        msgInput.value = "";

        // Simulate Coach Response Delay
        setTimeout(() => {
            const botResponse = generateAIResponse(text);
            appendChatBubble(botResponse, "bot");
            speakText(botResponse);
        }, 800);
    }

    function appendChatBubble(text, sender) {
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble", `${sender}-bubble`);
        bubble.innerHTML = `<p>${text}</p><span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}

// OCR Bill analyzer
function setupOCRAnalyzer() {
    const dropZone = document.getElementById("ocr-drop-zone");
    const fileInput = document.getElementById("ocr-file-input");
    const scannerOverlay = document.getElementById("ocr-scanner-overlay");
    const resultsEmpty = document.getElementById("ocr-results-empty");
    const resultsLoaded = document.getElementById("ocr-results-loaded");
    
    const sampleBtns = document.querySelectorAll(".sample-invoice-btn");
    const commitBtn = document.getElementById("ocr-commit-btn");

    // Click dropzone triggers file choose
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-active");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-active");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-active");
        if (e.dataTransfer.files.length > 0) {
            processOCR(e.dataTransfer.files[0].name);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            processOCR(e.target.files[0].name);
        }
    });

    sampleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const sampleType = btn.getAttribute("data-sample");
            if (sampleType === "electricity") {
                processOCR("electricity_bill_may2026.pdf", 320, "kWh", "electricity", 124.8);
            } else {
                processOCR("esso_gasoline_receipt.png", 40, "liters", "transport", 7.2);
            }
        });
    });

    commitBtn.addEventListener("click", () => {
        if (!currentMockOCRDoc) return;
        
        // Log the document values
        const newLog = {
            id: `log-${Date.now()}`,
            category: currentMockOCRDoc.category,
            value: currentMockOCRDoc.value,
            unit: currentMockOCRDoc.unit,
            subtype: currentMockOCRDoc.category === "energy" ? "electricity" : "car-gasoline",
            co2: currentMockOCRDoc.co2,
            date: new Date().toISOString().split("T")[0]
        };

        APP_STATE.logs.unshift(newLog);
        awardXP(50);
        triggerStreakProgress();
        saveStateToStorage();
        updateUI();
        
        // Reset results display
        resultsLoaded.classList.add("hidden");
        resultsEmpty.classList.remove("hidden");
        currentMockOCRDoc = null;
        
        speakText("Successfully parsed and logged utility metrics via neural networks OCR.");
    });

    function processOCR(filename, mockVal = 180, mockUnit = "kWh", category = "energy", mockCO2 = 70.2) {
        scannerOverlay.classList.remove("hidden");
        
        // Simulate scanning animation time
        setTimeout(() => {
            scannerOverlay.classList.add("hidden");
            resultsEmpty.classList.add("hidden");
            resultsLoaded.classList.remove("hidden");
            
            document.getElementById("ocr-doc-type").textContent = filename.split(".").pop().toUpperCase() + " Doc";
            document.getElementById("ocr-extracted-units").textContent = `${mockVal} ${mockUnit}`;
            document.getElementById("ocr-carbon-calc").textContent = `${mockCO2} kg CO₂e`;
            
            // Set state for commit
            currentMockOCRDoc = {
                category: category,
                value: mockVal,
                unit: mockUnit,
                co2: mockCO2
            };
        }, 1800);
    }
}

// User settings & buttons
function setupSettings() {
    const contrastToggle = document.getElementById("contrast-toggle");
    const langSelector = document.getElementById("lang-selector");
    const voiceBtn = document.getElementById("voice-activation-btn");
    const voiceIcon = document.getElementById("voice-icon");
    const gdprBtn = document.getElementById("gdpr-purge-btn");

    // Accessibility Contrast Toggle
    contrastToggle.addEventListener("click", () => {
        APP_STATE.contrastMode = !APP_STATE.contrastMode;
        document.body.classList.toggle("high-contrast", APP_STATE.contrastMode);
        saveStateToStorage();
    });

    // Translation Switcher
    langSelector.addEventListener("change", (e) => {
        const lang = e.target.value;
        APP_STATE.language = lang;
        saveStateToStorage();
        updateTranslations();
    });

    // Voice Activation Toggle
    voiceBtn.addEventListener("click", () => {
        APP_STATE.voiceEnabled = !APP_STATE.voiceEnabled;
        if (APP_STATE.voiceEnabled) {
            voiceIcon.setAttribute("data-lucide", "volume-2");
            voiceIcon.style.color = "var(--color-green)";
            speakText("Voice assistance feedback enabled.");
        } else {
            voiceIcon.setAttribute("data-lucide", "volume-x");
            voiceIcon.style.color = "var(--text-secondary)";
        }
        lucide.createIcons();
        saveStateToStorage();
    });

    // GDPR Purge button
    gdprBtn.addEventListener("click", () => {
        const confirmPurge = confirm("GDPR Compliance Action:\nAre you absolutely sure you want to delete all personal activity logs, user stats, and local profile metrics? This action cannot be undone.");
        if (confirmPurge) {
            localStorage.removeItem("carbonwise_state");
            APP_STATE.logs = [];
            APP_STATE.profile.xp = 0;
            APP_STATE.profile.streak = 0;
            APP_STATE.sustainabilityScore = 100;
            saveStateToStorage();
            updateUI();
            alert("GDPR Purge Completed: All user tracking data has been scrubbed from local memory.");
        }
    });
}

// ==========================================
// 5. UPDATE AND RENDERING ENGINES
// ==========================================
function updateUI() {
    // 1. Calculate totals
    const totalCO2 = APP_STATE.logs.reduce((acc, curr) => acc + curr.co2, 0);
    APP_STATE.budget.used = parseFloat(totalCO2.toFixed(1));
    APP_STATE.budget.remaining = parseFloat((APP_STATE.budget.allowed - APP_STATE.budget.used).toFixed(1));
    
    if (APP_STATE.budget.remaining < 0) APP_STATE.budget.remaining = 0;

    // 2. Compute Sustainability score using the weighted formula
    calculateSustainabilityScore();

    // 3. Update Text Values
    document.getElementById("sustainability-score-num").textContent = APP_STATE.sustainabilityScore;
    document.getElementById("budget-allowed-val").textContent = `${APP_STATE.budget.allowed} kg`;
    document.getElementById("budget-used-val").textContent = `${APP_STATE.budget.used} kg`;
    document.getElementById("budget-remaining-val").textContent = `${APP_STATE.budget.remaining} kg`;

    // 4. Update Budget Progress Bar Fill
    const budgetPct = Math.min(100, (APP_STATE.budget.used / APP_STATE.budget.allowed) * 100);
    const progressFill = document.getElementById("budget-progress-fill");
    progressFill.style.width = `${budgetPct}%`;
    if (budgetPct > 90) {
        progressFill.style.background = "var(--color-danger)";
    } else if (budgetPct > 70) {
        progressFill.style.background = "var(--color-warning)";
    } else {
        progressFill.style.background = "linear-gradient(90deg, var(--color-green), var(--color-purple))";
    }

    // 5. Update circular dashboard score ring
    const dashProgress = document.getElementById("score-progress-bar");
    // Circle length is 283; Formula: 283 - (283 * Score / 100)
    const offset = 283 - (283 * APP_STATE.sustainabilityScore) / 100;
    dashProgress.style.strokeDashoffset = offset;

    // Dynamic rating grade text
    const gradeText = document.getElementById("score-grade-text");
    if (APP_STATE.sustainabilityScore >= 85) {
        gradeText.textContent = "Status: Premium Eco Citizen";
        gradeText.className = "score-level-text text-green";
    } else if (APP_STATE.sustainabilityScore >= 65) {
        gradeText.textContent = "Status: Sustainable Resident";
        gradeText.className = "score-level-text text-purple";
    } else {
        gradeText.textContent = "Status: High-Emitting Footprint";
        gradeText.className = "score-level-text text-danger";
    }

    // 6. Sidebar profile
    document.querySelector(".user-name").textContent = APP_STATE.profile.username;
    document.querySelector(".streak-count-val").textContent = `${APP_STATE.profile.streak} Days Streak`;

    // 7. Render Recent Logs List
    renderLogsList();

    // 8. Load charts
    renderEmissionCharts();

    // 9. Load Explainable AI recommendations
    renderAIRecommendations();

    // 10. Load Gamification badges
    renderGamificationBadges();

    // 11. Run Twin forecast calculations
    updateTwinProjections();

    // Trigger theme
    document.body.classList.toggle("high-contrast", APP_STATE.contrastMode);
    
    // Set language switcher value
    document.getElementById("lang-selector").value = APP_STATE.language;
    updateTranslations();
    
    // Save to storage
    saveStateToStorage();
}

function calculateSustainabilityScore() {
    // Categories scores out of 100
    // Carbon Efficiency (40%): target threshold 150kg
    const carbonEfficiencyScore = Math.max(0, Math.min(100, 100 - (APP_STATE.budget.used / APP_STATE.budget.allowed) * 50));
    
    // Compute category specific values from logs to score categories
    const totals = { transport: 0, energy: 0, food: 0, waste: 0, water: 0 };
    APP_STATE.logs.forEach(log => {
        if (totals[log.category] !== undefined) {
            totals[log.category] += log.co2;
        }
    });

    const transportScore = Math.max(0, 100 - (totals.transport * 1.5));
    const energyScore = Math.max(0, 100 - (totals.energy * 0.8));
    const wasteScore = Math.max(0, 100 - (totals.waste * 5));
    const waterScore = Math.max(0, 100 - (totals.water * 10));

    // Weighted composition calculation
    const calculatedScore = Math.round(
        (carbonEfficiencyScore * 0.4) +
        (energyScore * 0.2) +
        (transportScore * 0.2) +
        (wasteScore * 0.1) +
        (waterScore * 0.1)
    );

    APP_STATE.sustainabilityScore = calculatedScore;
}

function renderLogsList() {
    const list = document.getElementById("recent-logs-list");
    list.innerHTML = "";
    
    if (APP_STATE.logs.length === 0) {
        list.innerHTML = `<div class="ocr-results-placeholder" style="height: auto; padding: 1rem;"><p>No logs logged yet. Add your activities above.</p></div>`;
        return;
    }

    APP_STATE.logs.forEach(log => {
        let iconName = "leaf";
        switch (log.category) {
            case "transport": iconName = "bus"; break;
            case "energy": iconName = "zap"; break;
            case "food": iconName = "apple"; break;
            case "shopping": iconName = "shopping-bag"; break;
            case "waste": iconName = "recycle"; break;
            case "water": iconName = "droplet"; break;
            case "digital": iconName = "monitor"; break;
        }
        
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span class="log-details">${log.category.charAt(0).toUpperCase() + log.category.slice(1)} (${log.value} ${log.unit})</span>
            <span class="log-date">${log.date}</span>
            <span class="log-co2">+${log.co2} kg</span>
        `;
        list.appendChild(logItem);
    });

    lucide.createIcons();
}

function renderEmissionCharts() {
    const ctx = document.getElementById("emissionDoughnutChart").getContext("2d");
    
    // Group totals by category
    const categoryTotals = {
        transport: 0,
        energy: 0,
        food: 0,
        shopping: 0,
        waste: 0,
        water: 0,
        digital: 0
    };

    APP_STATE.logs.forEach(log => {
        if (categoryTotals[log.category] !== undefined) {
            categoryTotals[log.category] += log.co2;
        }
    });

    const totalCO2Val = parseFloat(Object.values(categoryTotals).reduce((a, b) => a + b, 0).toFixed(1));
    document.getElementById("chart-total-co2").textContent = totalCO2Val;

    const chartData = {
        labels: ["Transport", "Energy", "Diet", "Shopping", "Waste", "Water", "Digital"],
        datasets: [{
            data: [
                categoryTotals.transport,
                categoryTotals.energy,
                categoryTotals.food,
                categoryTotals.shopping,
                categoryTotals.waste,
                categoryTotals.water,
                categoryTotals.digital
            ],
            backgroundColor: [
                "#8b5cf6", // Transport purple
                "#f59e0b", // Energy amber
                "#10b981", // Diet emerald
                "#ec4899", // Shopping pink
                "#3b82f6", // Waste blue
                "#06b6d4", // Water cyan
                "#6b7280"  // Digital gray
            ],
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.05)"
        }]
    };

    if (emissionChart) {
        emissionChart.data = chartData;
        emissionChart.update();
    } else {
        emissionChart = new Chart(ctx, {
            type: "doughnut",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            color: "#9ca3af",
                            font: {
                                family: "Plus Jakarta Sans"
                            }
                        }
                    }
                },
                cutout: "70%"
            }
        });
    }
}

function renderAIRecommendations() {
    const list = document.getElementById("explainable-recs-list");
    list.innerHTML = "";

    const recommendations = [
        {
            title: "Replace incandescent with LED bulbs",
            category: "Energy Conservation",
            why: "Your energy usage is currently accounting for a high percentage of your overall carbon budget.",
            reason: "LEDs use up to 85% less electricity and last 25 times longer than typical incandescent wiring bulbs.",
            savings: 45,
            effort: "Low",
            badgeClass: "badge-low"
        },
        {
            title: "Shift to EV or Public Bus route",
            category: "Clean Commuter",
            why: "A high volume of private combustion transport entries is logged in your history.",
            reason: "Public transit buses emit approximately 66% less carbon emissions per passenger kilometer than gasoline cars.",
            savings: 140,
            effort: "Medium",
            badgeClass: "badge-med"
        }
    ];

    recommendations.forEach(rec => {
        const card = document.createElement("div");
        card.className = "rec-card";
        card.innerHTML = `
            <div class="rec-header">
                <div class="rec-title-wrapper">
                    <span class="rec-title">${rec.title}</span>
                    <div class="rec-badge-row">
                        <span class="rec-badge ${rec.badgeClass}">Effort: ${rec.effort}</span>
                        <span class="rec-badge badge-reduction">Reduction: -${rec.savings} kg CO₂/yr</span>
                    </div>
                </div>
                <i data-lucide="info" class="text-purple" style="width:16px; height:16px;"></i>
            </div>
            <div class="rec-body">
                <p><strong>Why Suggested:</strong> ${rec.why}</p>
                <p class="scientific-reasoning"><strong>Science Core:</strong> ${rec.reason}</p>
            </div>
            <button class="rec-action-btn" onclick="adoptHabitNudge('${rec.title}', ${rec.savings})">Adopt Recommendation</button>
        `;
        list.appendChild(card);
    });

    lucide.createIcons();
}

function renderGamificationBadges() {
    const container = document.getElementById("badges-grid-display");
    container.innerHTML = "";

    APP_STATE.badges.forEach(badge => {
        const box = document.createElement("div");
        box.className = `badge-item-box ${badge.earned ? 'earned' : 'locked'}`;
        
        let iconName = "award";
        if (badge.icon === "shield") iconName = "shield";
        else if (badge.icon === "bus") iconName = "bus";
        else if (badge.icon === "recycle") iconName = "recycle";
        else if (badge.icon === "apple") iconName = "apple";

        box.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span class="badge-name">${badge.name}</span>
            <span class="badge-desc">${badge.desc}</span>
        `;
        container.appendChild(box);
    });

    lucide.createIcons();
}

function updateTwinProjections() {
    const scenario = APP_STATE.activeTwinScenario;
    const nameEl = document.getElementById("active-scenario-name");
    
    // Baseline annual emission based on current logs
    const monthlyTotal = APP_STATE.logs.reduce((acc, curr) => acc + curr.co2, 0);
    const annualBaseline = monthlyTotal * 12;

    let reductionPct = 0;
    let scenarioText = "Current Lifestyle";
    
    switch (scenario) {
        case "current":
            reductionPct = 0;
            scenarioText = "Current Lifestyle";
            break;
        case "transit":
            reductionPct = 22; // 22% reduction
            scenarioText = "Transit Transition";
            break;
        case "diet":
            reductionPct = 15; // 15% diet reduction
            scenarioText = "Dietary Reset";
            break;
        case "renewables":
            reductionPct = 35; // 35% home solar shift
            scenarioText = "Renewable Revolution";
            break;
    }

    const calculatedReduction = (annualBaseline * reductionPct) / 100;
    const finalAnnualEmission = annualBaseline - calculatedReduction;
    
    const yr1 = Math.round(finalAnnualEmission);
    const yr5 = Math.round(finalAnnualEmission * 5);
    const yr10 = Math.round(finalAnnualEmission * 10);
    
    // Assuming 1 tree absorbs 22kg CO2 per year
    const treesOffset = Math.round(finalAnnualEmission / 22);

    nameEl.textContent = scenarioText;
    document.getElementById("twin-1yr-val").textContent = `${yr1.toLocaleString()} kg CO₂e`;
    document.getElementById("twin-5yr-val").textContent = `${yr5.toLocaleString()} kg CO₂e`;
    document.getElementById("twin-10yr-val").textContent = `${yr10.toLocaleString()} kg CO₂e`;
    
    document.getElementById("twin-reduction-achieved").textContent = `${reductionPct}% (Saved ${Math.round(calculatedReduction)} kg/yr)`;
    document.getElementById("twin-trees-val").textContent = `${treesOffset} Trees / Year`;
}

// Behavioral nudging adopt action
window.adoptHabitNudge = function(habitTitle, savingsAmount) {
    alert(`Success: Recommendation Adopted!\n"${habitTitle}" has been added to your goals. You've earned +40 XP and reinforced your carbon budget.`);
    
    // Modify State
    awardXP(40);
    triggerStreakProgress();
    
    // Log a negative offset or decrease current logs to reflect success
    const newLog = {
        id: `log-${Date.now()}`,
        category: "energy",
        value: 1,
        unit: "offsets",
        subtype: "recs",
        co2: -Math.min(savingsAmount / 12, 10), // Limit offset impact per action
        date: new Date().toISOString().split("T")[0]
    };
    APP_STATE.logs.unshift(newLog);
    
    saveStateToStorage();
    updateUI();
};

function awardXP(amount) {
    APP_STATE.profile.xp += amount;
    if (APP_STATE.profile.xp >= 600 && APP_STATE.profile.level < 5) {
        APP_STATE.profile.level = 5;
        APP_STATE.badges.forEach(b => {
            if (b.id === "badge-zero") b.earned = true;
        });
        speakText("Level Up! You have reached level 5 climate champion and unlocked the Zero Waste Hero badge.");
    }
}

function triggerStreakProgress() {
    if (!APP_STATE.profile.streakActive) {
        APP_STATE.profile.streak += 1;
        APP_STATE.profile.streakActive = true;
    }
}

// Local Storage Helper
function saveStateToStorage() {
    localStorage.setItem("carbonwise_state", JSON.stringify(APP_STATE));
}

// Translations Swapper
function updateTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (TRANSLATIONS[APP_STATE.language] && TRANSLATIONS[APP_STATE.language][key]) {
            el.textContent = TRANSLATIONS[APP_STATE.language][key];
        }
    });
}

// Text-to-Speech Engine
function speakText(text) {
    if (!APP_STATE.voiceEnabled || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = APP_STATE.language === "en" ? "en-US" : 
                     APP_STATE.language === "es" ? "es-ES" : 
                     APP_STATE.language === "fr" ? "fr-FR" : "de-DE";
                     
    window.speechSynthesis.speak(utterance);
}

// NLP simulated response engine
function generateAIResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes("calculate") || q.includes("score") || q.includes("formula")) {
        return "Your Sustainability Score is computed dynamically. The formula is: Carbon Efficiency (40%), Energy Usage (20%), Transportation (20%), Waste Management (10%), and Water Conservation (10%). Currently, your score is " + APP_STATE.sustainabilityScore + " out of 100.";
    }
    
    if (q.includes("transport") || q.includes("car") || q.includes("transit") || q.includes("bus")) {
        return "Transportation is your largest carbon driver. Shifting car trips to public transit buses decreases emissions by 66% per passenger-kilometer, while cycling or walking has a 0 kg CO₂e impact.";
    }
    
    if (q.includes("diet") || q.includes("meat") || q.includes("food") || q.includes("vegan")) {
        return "A meat-heavy diet emits 7.2 kg CO₂e per day, average mixed diet is 4.5 kg, vegetarian is 2.0 kg, and a vegan diet is only 1.2 kg. Shifting dietary inputs can reduce your emissions by up to 25% annually.";
    }
    
    if (q.includes("save") || q.includes("reduce") || q.includes("cut")) {
        return "The highest impact, lowest effort step you can make is to shift energy providers to a clean, renewable solar/wind grid. This cuts home heating/cooling footprint liability by approximately 35%.";
    }

    if (q.includes("budget") || q.includes("allowance")) {
        return "Your Monthly Carbon Budget is set to " + APP_STATE.budget.allowed + " kg CO₂e. This is aligned with the Paris Agreement 1.5°C climate model targets. You have " + APP_STATE.budget.remaining + " kg remaining.";
    }
    
    return "That is an excellent climate inquiry. To support your goal of reducing individual emissions by 18-25%, I recommend exploring the AI Carbon Twin simulator view to forecast long-term lifestyle adjustment scenarios!";
}
