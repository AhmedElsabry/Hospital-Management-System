console.log("%c Nabdh System v2.2 ", "background: #102a5a; color: #00d4ff; padding: 8px; border-radius: 5px; font-weight: bold;");

// ===========================
// Outline 1: Dark Mode
// ===========================
const darkToggle = document.getElementById("darkToggle");
const darkIcon   = document.getElementById("darkIcon");
const darkLabel  = document.getElementById("darkLabel");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (darkIcon)  darkIcon.className    = "fas fa-sun";
    if (darkLabel) darkLabel.textContent = "الوضع النهاري";
}

darkToggle?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    if (darkIcon)  darkIcon.className    = isDark ? "fas fa-sun"      : "fas fa-moon";
    if (darkLabel) darkLabel.textContent = isDark ? "الوضع النهاري"  : "الوضع الليلي";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===========================
// Outline 2: Menu Active State
// ===========================
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===========================
// Outline 3: Toast Notifications
// ===========================
function showToast(msg) {
    document.querySelector(".toast-msg")?.remove();
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("show")));
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ============================================================
// Outline 4: Doctors Management (إدارة الأطباء)
// ============================================================

// Outline 4.1: localStorage — Doctors Default Data & Storage
const defaultDoctors = [
    { code: "DR-001", name: "د. أحمد محمود علي", specialty: "باطنة",  status: "نشط",  phone: "0501234567" },
    { code: "DR-002", name: "د. سارة خالد حسن",  specialty: "أطفال",  status: "نشط",  phone: "0507654321" },
];

const doctors = JSON.parse(localStorage.getItem("doctors")) || defaultDoctors;

let doctorCounter = doctors.length > 0
    ? parseInt(doctors[doctors.length - 1].code.replace("DR-", ""), 10)
    : 0;

function saveDoctorsToStorage() {
    localStorage.setItem("doctors", JSON.stringify(doctors));
}

// Outline 4.2: Render Doctor Table
function renderDoctorTable(data) {
    const tbody = document.querySelector("#doctorTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted); font-size:14px;">
                    <i class="fas fa-search" style="font-size:24px; margin-bottom:8px; display:block; opacity:0.4;"></i>
                    لا توجد نتائج مطابقة
                </td>
            </tr>`;
        return;
    }

    data.forEach(doc => {
        const isActive = doc.status === "نشط";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span style="font-weight:600; color:#1565C0; font-size:13px;">${doc.code}</span></td>
            <td><span style="font-weight:600;">${doc.name}</span></td>
            <td>${doc.specialty}</td>
            <td>
                <span class="badge-status ${isActive ? 'badge-active' : 'badge-pending'}">
                    ${doc.status}
                </span>
            </td>
            <td style="direction:ltr; text-align:right;">${doc.phone}</td>
            <td>
                <button class="action-btn view"   title="عرض"   onclick="handleDoctorAction('view',   '${doc.code}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit"   title="تعديل" onclick="handleDoctorAction('edit',   '${doc.code}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" title="حذف"   onclick="handleDoctorAction('delete', '${doc.code}')"><i class="fas fa-trash"></i></button>
            </td>`;
        tbody.appendChild(tr);
    });
}

// Outline 4.3: Search & Filter Doctors
function filterDoctorTable(searchValue) {
    const statusFilter = document.querySelector(".filter-select")?.value || "";
    applyDoctorFilters(searchValue, statusFilter);
}

function filterDoctorTableByStatus(statusValue) {
    const searchValue = document.querySelector("#doctorSearch")?.value || "";
    applyDoctorFilters(searchValue, statusValue);
}

function applyDoctorFilters(searchValue, statusValue) {
    const q = searchValue.trim().toLowerCase();
    const filtered = doctors.filter(doc => {
        const matchSearch = !q ||
            doc.name.toLowerCase().includes(q) ||
            doc.specialty.toLowerCase().includes(q) ||
            doc.code.toLowerCase().includes(q);
        const matchStatus = !statusValue || doc.status === statusValue;
        return matchSearch && matchStatus;
    });
    renderDoctorTable(filtered);
}

// Outline 4.4: Doctor Actions (View / Edit / Delete)
function handleDoctorAction(type, code) {
    const doctor = doctors.find(d => d.code === code);
    if (!doctor) return;

    if (type === "view") {
        alert(`بيانات الطبيب\n\nالكود: ${doctor.code}\nالاسم: ${doctor.name}\nالتخصص: ${doctor.specialty}\nالحالة: ${doctor.status}\nالهاتف: ${doctor.phone}`);
    } else if (type === "edit") {
        openEditDoctorModal(doctor);
    } else if (type === "delete") {
        if (confirm(`هل أنت متأكد من حذف ${doctor.name}؟`)) {
            const idx = doctors.indexOf(doctor);
            if (idx > -1) {
                doctors.splice(idx, 1);
                saveDoctorsToStorage();
                renderDoctorTable(doctors);
                updateDoctorCount();
                populateDoctorDropdown();
            }
        }
    }
}

function updateDoctorCount() {
    const countEl = document.querySelector(".page-header p");
    if (countEl) countEl.textContent = `${doctors.length} طبيب مسجل في النظام`;
}

// Outline 4.5: Auto Doctor Code Generator
function generateNextDoctorCode() {
    doctorCounter++;
    return "DR-" + String(doctorCounter).padStart(3, "0");
}

// Outline 4.6: Doctor Modal Template
function getDoctorModalHTML(title, subtitle, saveId) {
    return `
        <div class="modal-backdrop" id="modalBackdrop"></div>
        <div class="modal-box" role="dialog" aria-modal="true">
            <div class="modal-header">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:36px;height:36px;background:#E3F0FF;border-radius:9px;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-user-md" style="color:#1565C0;font-size:16px;"></i>
                    </div>
                    <div>
                        <h3 style="margin:0;font-size:16px;font-weight:700;color:#1A2340;">${title}</h3>
                        <p style="margin:0;font-size:12px;color:#64748b;">${subtitle}</p>
                    </div>
                </div>
                <button class="modal-close-btn" id="modalCloseBtn" aria-label="إغلاق">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">كود الطبيب</label>
                    <input type="text" id="field-code" class="form-input" readonly
                           style="background:#F5F8FF;color:#1565C0;font-weight:700;cursor:not-allowed;">
                </div>
                <div class="form-group">
                    <label class="form-label">اسم الطبيب <span style="color:#C62828;">*</span></label>
                    <input type="text" id="field-name" class="form-input" placeholder="مثال: د. أحمد محمود علي">
                    <span class="form-error" id="err-name"></span>
                </div>
                <div class="form-group">
                    <label class="form-label">التخصص <span style="color:#C62828;">*</span></label>
                    <select id="field-specialty" class="form-input form-select">
                        <option value="">-- اختر التخصص --</option>
                        <option>باطنة</option><option>أطفال</option><option>جراحة عامة</option>
                        <option>طوارئ</option></select>
                    <span class="form-error" id="err-specialty"></span>
                </div>
                <div class="form-group">
                    <label class="form-label">رقم الهاتف <span style="color:#C62828;">*</span></label>
                    <input type="tel" id="field-phone" class="form-input" placeholder="05XXXXXXXX"
                           maxlength="10" style="direction:ltr;text-align:right;">
                    <span class="form-error" id="err-phone"></span>
                </div>
                <div class="form-group">
                    <label class="form-label">الحالة</label>
                    <div style="display:flex;gap:12px;margin-top:6px;">
                        <label class="radio-option">
                            <input type="radio" name="drStatus" value="نشط" checked>
                            <span class="radio-label active-label"><i class="fas fa-circle" style="font-size:7px;"></i> نشط</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="drStatus" value="إجازة">
                            <span class="radio-label leave-label"><i class="fas fa-circle" style="font-size:7px;"></i> إجازة</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-custom" id="${saveId}">
                    <i class="fas fa-check"></i> ${title}
                </button>
                <button class="btn-cancel" id="modalCancelBtn">إلغاء</button>
            </div>
        </div>`;
}

// Outline 4.7: Doctor Form Validation
function validateDoctorForm() {
    const name      = document.getElementById("field-name").value.trim();
    const specialty = document.getElementById("field-specialty").value;
    const phone     = document.getElementById("field-phone").value.trim();
    let valid = true;

    if (!name) {
        document.getElementById("err-name").textContent = "الاسم مطلوب";
        document.getElementById("field-name").classList.add("error");
        valid = false;
    } else {
        document.getElementById("err-name").textContent = "";
        document.getElementById("field-name").classList.remove("error");
    }

    if (!specialty) {
        document.getElementById("err-specialty").textContent = "اختر التخصص";
        document.getElementById("field-specialty").classList.add("error");
        valid = false;
    } else {
        document.getElementById("err-specialty").textContent = "";
        document.getElementById("field-specialty").classList.remove("error");
    }

    if (!phone || !/^05\d{8}$/.test(phone)) {
        document.getElementById("err-phone").textContent = "رقم غير صحيح — يبدأ بـ 05 ويتكون من 10 أرقام";
        document.getElementById("field-phone").classList.add("error");
        valid = false;
    } else {
        document.getElementById("err-phone").textContent = "";
        document.getElementById("field-phone").classList.remove("error");
    }

    return valid;
}

function getDoctorFormValues() {
    return {
        name:      document.getElementById("field-name").value.trim(),
        specialty: document.getElementById("field-specialty").value,
        phone:     document.getElementById("field-phone").value.trim(),
        status:    document.querySelector('input[name="drStatus"]:checked').value,
        code:      document.getElementById("field-code").value,
    };
}

function clearDoctorFormErrors() {
    ["field-name", "field-specialty", "field-phone"].forEach(id =>
        document.getElementById(id)?.classList.remove("error")
    );
    ["err-name", "err-specialty", "err-phone"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}

// Outline 4.8: Add Doctor Modal
function createAddDoctorModal() {
    if (document.getElementById("addDoctorModal")) return;
    const modal = document.createElement("div");
    modal.id = "addDoctorModal";
    modal.innerHTML = getDoctorModalHTML("إضافة طبيب جديد", "أدخل بيانات الطبيب كاملة", "modalSaveBtn");
    document.body.appendChild(modal);

    document.getElementById("modalBackdrop").addEventListener("click", closeAddDoctorModal);
    document.getElementById("modalCloseBtn").addEventListener("click", closeAddDoctorModal);
    document.getElementById("modalCancelBtn").addEventListener("click", closeAddDoctorModal);
    document.getElementById("modalSaveBtn").addEventListener("click", saveDoctor);
    document.addEventListener("keydown", function escAdd(e) {
        if (e.key === "Escape") { closeAddDoctorModal(); document.removeEventListener("keydown", escAdd); }
    });
}

function openAddDoctorModal() {
    createAddDoctorModal();
    document.getElementById("field-code").value      = generateNextDoctorCode();
    document.getElementById("field-name").value      = "";
    document.getElementById("field-phone").value     = "";
    document.getElementById("field-specialty").value = "";
    document.querySelector('input[name="drStatus"][value="نشط"]').checked = true;
    clearDoctorFormErrors();
}

function saveDoctor() {
    if (!validateDoctorForm()) return;
    const { code, name, specialty, status, phone } = getDoctorFormValues();
    doctors.push({ code, name, specialty, status, phone });
    saveDoctorsToStorage();
    renderDoctorTable(doctors);
    updateDoctorCount();
    populateDoctorDropdown();
    closeAddDoctorModal();
    showToast(`تم إضافة ${name} بنجاح ✅`);
}

function closeAddDoctorModal() {
    const modal = document.getElementById("addDoctorModal");
    if (!modal) return;
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.2s";
    setTimeout(() => modal.remove(), 200);
}

// Outline 4.9: Edit Doctor Modal
function createEditDoctorModal() {
    if (document.getElementById("editDoctorModal")) return;
    const modal = document.createElement("div");
    modal.id = "editDoctorModal";
    modal.innerHTML = getDoctorModalHTML("تعديل بيانات الطبيب", "عدّل البيانات ثم احفظ", "editSaveBtn");
    document.body.appendChild(modal);

    document.getElementById("modalBackdrop").addEventListener("click", closeEditDoctorModal);
    document.getElementById("modalCloseBtn").addEventListener("click", closeEditDoctorModal);
    document.getElementById("modalCancelBtn").addEventListener("click", closeEditDoctorModal);
    document.getElementById("editSaveBtn").addEventListener("click", updateDoctor);
    document.addEventListener("keydown", function escEdit(e) {
        if (e.key === "Escape") { closeEditDoctorModal(); document.removeEventListener("keydown", escEdit); }
    });
}

function openEditDoctorModal(doctor) {
    createEditDoctorModal();
    document.getElementById("field-code").value      = doctor.code;
    document.getElementById("field-name").value      = doctor.name;
    document.getElementById("field-phone").value     = doctor.phone;
    document.getElementById("field-specialty").value = doctor.specialty;
    document.querySelector(`input[name="drStatus"][value="${doctor.status}"]`).checked = true;
    clearDoctorFormErrors();
}

function updateDoctor() {
    if (!validateDoctorForm()) return;
    const { code, name, specialty, status, phone } = getDoctorFormValues();
    const idx = doctors.findIndex(d => d.code === code);
    if (idx > -1) doctors[idx] = { code, name, specialty, status, phone };
    saveDoctorsToStorage();
    renderDoctorTable(doctors);
    updateDoctorCount();
    populateDoctorDropdown();
    closeEditDoctorModal();
    showToast(`تم تعديل بيانات ${name} بنجاح ✏️`);
}

function closeEditDoctorModal() {
    const modal = document.getElementById("editDoctorModal");
    if (!modal) return;
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.2s";
    setTimeout(() => modal.remove(), 200);
}

// ============================================================
// Outline 5: Appointments Management (إدارة المواعيد)
// ============================================================

// Outline 5.1: localStorage — Appointments Data & Storage
const APPOINTMENTS_DB = 'NABDH_FINAL_APP_DB';
let appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_DB)) || [];
let myChart = null;

function saveAppointmentsToStorage() {
    localStorage.setItem(APPOINTMENTS_DB, JSON.stringify(appointments));
}

// Outline 5.2: Update & Sync Appointments
function updateAppointments() {
    saveAppointmentsToStorage();

    const tb = document.getElementById('appointmentsTable');
    if (tb) renderAppointmentsTable(tb, appointments);

    const chartCtx = document.getElementById('revenueChart');
    if (chartCtx) { renderDashboard(); renderDepartments(); }
    renderAppointmentsDashboard();
}

// Outline 5.3: Render Appointments Table
function renderAppointmentsTable(tb, data) {
    tb.innerHTML = "";

    if (data.length === 0) {
        tb.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:50px; color:#94a3b8;">لا توجد مواعيد حالياً</td></tr>';
        return;
    }

    tb.innerHTML = data.map((a, i) => {
        const isGreen = ['نشط', 'قيد الانتظار', 'مكتمل'].includes(a.status);
        return `
        <tr>
            <td style="color:#3b82f6; font-weight:bold;">#D-0${i + 1}</td>
            <td><b>${a.patient}</b></td>
            <td>${a.doctor}</td>
            <td>${a.time}</td>
            <td>${a.date}</td>
            <td>${a.field}</td>
            <td>
                <span style="background:${isGreen ? '#dcfce7' : '#fee2e2'};
                             color:${isGreen ? '#166534' : '#991b1b'};
                             padding:5px 12px; border-radius:15px; font-size:12px; font-weight:bold;">
                    ${a.status}
                </span>
            </td>
            <td>
                <button onclick="deleteAppointment(${i})"
                        style="color:#ef4444; border:none; background:none; cursor:pointer; font-weight:bold;">
                    حذف
                </button>
            </td>
        </tr>`;
    }).join('');
}

// Outline 5.4: Doctor Dropdown for Appointments Form
function populateDoctorDropdown() {
    const select = document.getElementById('newDoctor');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- اختر الطبيب --</option>';

    doctors.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc.name;
        opt.dataset.specialty = doc.specialty;
        opt.textContent = `${doc.name} — ${doc.specialty}`;
        if (doc.status !== 'نشط') opt.textContent += ' (إجازة)';
        select.appendChild(opt);
    });

    if (currentVal) select.value = currentVal;

    select.onchange = function () {
        const specialtyField = document.getElementById('fieldspecialty');
        if (!specialtyField) return;
        const selectedOpt = this.options[this.selectedIndex];
        specialtyField.value = selectedOpt.dataset.specialty || '';
        if (this.value) {
            specialtyField.setAttribute('disabled', true);
            specialtyField.style.background = '#F5F8FF';
            specialtyField.style.cursor     = 'not-allowed';
            specialtyField.style.color      = '#1565C0';
        } else {
            specialtyField.removeAttribute('disabled');
            specialtyField.style.background = '';
            specialtyField.style.cursor     = '';
            specialtyField.style.color      = '';
        }
    };
}

// Outline 5.5: Add & Delete Appointments
function addAppointment() {
    const p  = document.getElementById('newPatient');
    const d  = document.getElementById('newDoctor');
    const t  = document.getElementById('time');
    const da = document.getElementById('date');
    const fs = document.getElementById('fieldspecialty');
    const st = document.getElementById('newStatus');

    if (!p || !d) return;

    if (p.value.trim() && d.value.trim()) {
        appointments.push({
            patient: p.value.trim(),
            doctor:  d.value.trim(),
            time:    t?.value  || "",
            date:    da?.value || "",
            field:   fs?.value || "",
            status:  st?.value || "قيد الانتظار"
        });
        updateAppointments();
        p.value = "";
        d.value = "";
        if (t)  t.value  = "";
        if (da) da.value = "";
        if (fs) fs.value = "";
        if (st) st.value = "";
    } else {
        alert("يرجى ملء البيانات المطلوبة");
    }
}

function deleteAppointment(i) {
    if (confirm("حذف الموعد؟")) {
        appointments.splice(i, 1);
        updateAppointments();
    }
}

// Outline 5.6: Search & Filter Appointments
function filterAppointments() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const tb = document.getElementById('appointmentsTable');
    if (!tb) return;

    const filtered = appointments.filter(a =>
        a.patient.toLowerCase().includes(searchTerm) ||
        a.doctor.toLowerCase().includes(searchTerm)
    );
    renderAppointmentsTable(tb, filtered);
}

// ============================================================
// Outline 6: Dashboard (لوحة التحكم)
// ============================================================

// Outline 6.1: Doctors Dashboard Stats & Chart
function renderDashboard() {
    const totalEl = document.getElementById('stat-total');
    if (totalEl) totalEl.innerText = doctors.length;

    const active = doctors.filter(d => d.status === 'نشط').length;
    const away   = doctors.filter(d => d.status === 'إجازة').length;

    const activeEl = document.getElementById('stat-active');
    const awayEl   = document.getElementById('stat-away');

    if (activeEl) activeEl.innerText = active;
    if (awayEl)   awayEl.innerText   = away;

    const chartCanvas = document.getElementById('revenueChart');
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['نشط', 'إجازة', 'الإجمالي'],
            datasets: [{
                data: [active, away, patients.length],
                backgroundColor: ['#22c55e', '#ef4444', '#102a5a'],
                borderRadius: 10,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// Outline 6.2: Patients Dashboard Stats & Chart
function renderPatientsDashboard() {
    const males   = patients.filter(p => p.gender === 'ذكر').length;
    const females = patients.filter(p => p.gender === 'أنثى').length;

    const active    = appointments.filter(a => a.status === 'نشط').length;
    const waiting   = appointments.filter(a => a.status === 'قيد الانتظار').length;
    const cancelled = appointments.filter(a => a.status === 'ملغي').length;

    const activeEl    = document.getElementById('pstat-active');
    const waitingEl   = document.getElementById('pstat-waiting');
    const cancelledEl = document.getElementById('pstat-cancelled');

    if (activeEl)    activeEl.innerText    = active;
    if (waitingEl)   waitingEl.innerText   = waiting;
    if (cancelledEl) cancelledEl.innerText = cancelled;

    const chartCanvas = document.getElementById('patientsChart');
    if (!chartCanvas) return;

    if (window.patientsChart instanceof Chart) window.patientsChart.destroy();
    window.patientsChart = new Chart(chartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['إجمالي المرضى', 'ذكور', 'إناث'],
            datasets: [{
                data: [patients.length, males, females],
                backgroundColor: ['#102a5a', '#3b82f6', '#ec4899'],
                borderRadius: 10,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// Outline 6.3: Appointments Dashboard Stats & Chart
function renderAppointmentsDashboard() {
    const active    = appointments.filter(a => a.status === 'نشط').length;
    const waiting   = appointments.filter(a => a.status === 'قيد الانتظار').length;
    const cancelled = appointments.filter(a => a.status === 'ملغي').length;

    const activeEl    = document.getElementById('pstat-active');
    const waitingEl   = document.getElementById('pstat-waiting');
    const cancelledEl = document.getElementById('pstat-cancelled');

    if (activeEl)    activeEl.innerText    = active;
    if (waitingEl)   waitingEl.innerText   = waiting;
    if (cancelledEl) cancelledEl.innerText = cancelled;

    const chartCanvas = document.getElementById('appointmentsChart');
    if (!chartCanvas) return;

    if (window.appointmentsChart instanceof Chart) window.appointmentsChart.destroy();
    window.appointmentsChart = new Chart(chartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['نشط', 'قيد الانتظار', 'ملغي'],
            datasets: [{
                data: [active, waiting, cancelled],
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                borderRadius: 10,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// Outline 6.4: Department Breakdown (Progress Bars)
function renderDepartments() {
    const total = appointments.length;

    const depts = {
        'باطنة':      { percentId: 'percent-internal',   barId: 'bar-internal'   },
        'جراحة عامة': { percentId: 'percent-surgery',    barId: 'bar-surgery'    },
        'أطفال':      { percentId: 'percent-pediatrics', barId: 'bar-pediatrics' },
        'طوارئ':      { percentId: 'percent-emergency',  barId: 'bar-emergency'  },
    };

    Object.entries(depts).forEach(([name, ids]) => {
        const count   = appointments.filter(a => a.field === name).length;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        const percentEl = document.getElementById(ids.percentId);
        const barEl     = document.getElementById(ids.barId);

        if (percentEl) percentEl.textContent = percent + '%';
        if (barEl)     barEl.style.width     = percent + '%';
    });
}

// ============================================================
// Outline 7: Patients Management (إدارة المرضى)
// ============================================================

// Outline 7.1: localStorage — Patients Data & Patient Class
const PATIENTS_DB_KEY = 'NABDH_PATIENTS_DB';

class Patient {
    constructor(name, age, gender, phone, diagnosis) {
        this.name      = name;
        this.age       = age;
        this.gender    = gender;
        this.phone     = phone;
        this.diagnosis = diagnosis;
    }
}

let patients = JSON.parse(localStorage.getItem(PATIENTS_DB_KEY)) || [];

function savePatientsData() {
    localStorage.setItem(PATIENTS_DB_KEY, JSON.stringify(patients));
}

// Outline 7.2: Patients Stats (Total / Male / Female)
function updatePatientsStats() {
    const males   = patients.filter(p => p.gender === 'ذكر').length;
    const females = patients.filter(p => p.gender === 'أنثى').length;
    const totalEl  = document.getElementById('stat-total-patients');
    const maleEl   = document.getElementById('stat-male');
    const femaleEl = document.getElementById('stat-female');
    if (totalEl)  totalEl.textContent  = patients.length;
    if (maleEl)   maleEl.textContent   = males;
    if (femaleEl) femaleEl.textContent = females;
}

function getInitials(name) {
    return name.trim().charAt(0).toUpperCase();
}

// Outline 7.3: Render Patients Table
function renderPatientsTable(data) {
    const tb = document.getElementById('patientsTable');
    if (!tb) return;
    tb.innerHTML = '';

    if (data.length === 0) {
        tb.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:50px; color:#94a3b8;">لا يوجد مرضى حالياً</td></tr>';
        return;
    }

    tb.innerHTML = data.map((p, i) => `
        <tr>
            <td style="color:#3b82f6; font-weight:bold;">#P-${String(i+1).padStart(3,'0')}</td>
            <td>
                <span class="patient-avatar">${getInitials(p.name)}</span>
                <b>${p.name}</b>
            </td>
            <td>${p.age} سنة</td>
            <td>
                <span class="badge ${p.gender==='ذكر'?'badge-male':'badge-female'}">
                    ${p.gender==='ذكر'?'<i class="fas fa-mars"></i>':'<i class="fas fa-venus"></i>'} ${p.gender}
                </span>
            </td>
            <td>${p.phone}</td>
            <td>${p.diagnosis}</td>
            <td>
                <button class="action-btn btn-edit" onclick="openEditPatient(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deletePatient(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

// Outline 7.4: Update & Sync Patients
function updatePatients() {
    savePatientsData();
    updatePatientsStats();
    renderPatientsTable(patients);
    renderPatientsDashboard();
}

// Outline 7.5: Add Patient & Form Validation
function showPatientFormError(msg) {
    const el = document.getElementById('formError');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

function addPatient() {
    try {
        const name   = document.getElementById('newName').value.trim();
        const age    = document.getElementById('newAge').value.trim();
        const gender = document.getElementById('newGender').value;
        const phone  = document.getElementById('newPhone').value.trim();
        const diag   = document.getElementById('newDiag').value.trim();

        if (!name)  { showPatientFormError('⚠️ يرجى إدخال اسم المريض'); return; }
        if (!age || isNaN(age) || age < 1 || age > 120) { showPatientFormError('⚠️ يرجى إدخال عمر صحيح (1-120)'); return; }
        if (!phone) { showPatientFormError('⚠️ يرجى إدخال رقم الهاتف'); return; }
        if (!diag)  { showPatientFormError('⚠️ يرجى إدخال التشخيص أو الحالة'); return; }

        patients.push(new Patient(name, parseInt(age), gender, phone, diag));
        updatePatients();
        ['newName','newAge','newPhone','newDiag'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        showToast('✅ تم إضافة المريض بنجاح');
    } catch(err) {
        showPatientFormError('حدث خطأ غير متوقع');
        console.error('Add patient error:', err);
    }
}

// Outline 7.6: Delete Patient
function deletePatient(i) {
    if (confirm(`حذف المريض "${patients[i].name}"؟`)) {
        patients.splice(i, 1);
        updatePatients();
        showToast('🗑️ تم حذف المريض');
    }
}

// Outline 7.7: Edit Patient Modal
function openEditPatient(i) {
    const p = patients[i];
    document.getElementById('editIndex').value   = i;
    document.getElementById('editName').value    = p.name;
    document.getElementById('editAge').value     = p.age;
    document.getElementById('editGender').value  = p.gender;
    document.getElementById('editPhone').value   = p.phone;
    document.getElementById('editDiag').value    = p.diagnosis;
    document.getElementById('editModal').classList.add('open');
}

function closePatientModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('open');
}

function savePatientEdit() {
    try {
        const i      = parseInt(document.getElementById('editIndex').value);
        const name   = document.getElementById('editName').value.trim();
        const age    = document.getElementById('editAge').value.trim();
        const gender = document.getElementById('editGender').value;
        const phone  = document.getElementById('editPhone').value.trim();
        const diag   = document.getElementById('editDiag').value.trim();

        if (!name || !age || !phone || !diag) { alert('يرجى ملء جميع الحقول'); return; }

        patients[i] = new Patient(name, parseInt(age), gender, phone, diag);
        updatePatients();
        closePatientModal();
        showToast('✏️ تم تحديث بيانات المريض');
    } catch(err) {
        console.error('Edit error:', err);
        alert('حدث خطأ أثناء التعديل');
    }
}

// Outline 7.8: Search & Filter Patients
function filterPatients() {
    const term = document.getElementById('patientSearchInput')?.value.toLowerCase() || '';
    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.diagnosis.toLowerCase().includes(term) ||
        p.phone.includes(term)
    );
    renderPatientsTable(filtered);
}

// ============================================================
// Outline 8: Initialization (DOMContentLoaded)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

    // Outline 8.1: Doctors Init
    renderDoctorTable(doctors);
    updateDoctorCount();
    populateDoctorDropdown();

    const addDoctorBtn =
        document.getElementById("addDoctorBtn") ||
        document.querySelector(".btn-add-doctor") ||
        document.querySelector(".btn-primary-custom");
    addDoctorBtn?.addEventListener("click", openAddDoctorModal);

    // Outline 8.2: Appointments Init
    updateAppointments();

    // Outline 8.3: Dashboard Init
    if (document.getElementById('revenueChart')) {
        renderDashboard();
        renderDepartments();
        renderAppointmentsDashboard();
    }

    // Outline 8.4: Patients Init
    updatePatients();

    const addPatientBtn = document.getElementById('addBtn');
    addPatientBtn?.addEventListener('click', addPatient);

    document.getElementById('closeModal')?.addEventListener('click', closePatientModal);
    document.getElementById('cancelModal')?.addEventListener('click', closePatientModal);
    document.getElementById('saveEditBtn')?.addEventListener('click', savePatientEdit);

    document.getElementById('newDiag')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addPatient();
    });
});
