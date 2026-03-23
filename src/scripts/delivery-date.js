// Calcula la fecha estimada de entrega
// Reglas: corte 4PM CST, skip domingos y festivos
import { FIXED_HOLIDAYS, getMovableHolidays } from '../data/holidays.js';

const CUTOFF_HOUR = 16; // 4PM
const TIMEZONE = 'America/Mexico_City';

// Verifica si una fecha es día festivo
function isHoliday(date) {
	const year = date.getFullYear();
	const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

	// Festivos fijos
	if (FIXED_HOLIDAYS.includes(mmdd)) return true;

	// Festivos movibles del año actual
	const movable = getMovableHolidays(year);
	if (movable.includes(mmdd)) return true;

	return false;
}

// Verifica si una fecha es domingo
function isSunday(date) {
	return date.getDay() === 0;
}

// Avanza al siguiente día hábil (no domingo, no festivo)
function nextBusinessDay(date) {
	const next = new Date(date);
	next.setDate(next.getDate() + 1);

	while (isSunday(next) || isHoliday(next)) {
		next.setDate(next.getDate() + 1);
	}

	return next;
}

// Calcula la fecha de entrega
export function getDeliveryDate() {
	// Hora actual en zona horaria de México
	const now = new Date();
	const mxTime = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
	const currentHour = mxTime.getHours();

	let deliveryDate;

	if (currentHour < CUTOFF_HOUR) {
		// Antes de 4PM → entrega mañana (si es hábil)
		deliveryDate = nextBusinessDay(mxTime);
	} else {
		// Después de 4PM → entrega pasado mañana (si es hábil)
		const tomorrow = new Date(mxTime);
		tomorrow.setDate(tomorrow.getDate() + 1);
		deliveryDate = nextBusinessDay(tomorrow);
	}

	return deliveryDate;
}

// Formatea la fecha en español legible
export function formatDeliveryDate(date) {
	const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

	const dayName = days[date.getDay()];
	const day = date.getDate();
	const month = months[date.getMonth()];

	return `${dayName} ${day} de ${month}`;
}
