// Días festivos oficiales de México — editar aquí cada año
// Formato: 'MM-DD' para festivos fijos, fechas completas para los que cambian
// Los festivos con "lunes más cercano" se calculan automáticamente
export const FIXED_HOLIDAYS = [
	'01-01', // Año Nuevo
	'05-01', // Día del Trabajo
	'09-16', // Independencia
	'12-25', // Navidad
];

// Festivos que se mueven al lunes más cercano
// primer lunes de febrero = Constitución
// tercer lunes de marzo = Natalicio Benito Juárez
// tercer lunes de noviembre = Revolución
export function getMovableHolidays(year) {
	return [
		getNthMonday(year, 1, 1),  // 1er lunes de febrero
		getNthMonday(year, 2, 3),  // 3er lunes de marzo
		getNthMonday(year, 10, 3), // 3er lunes de noviembre
	];
}

// Obtiene el N-ésimo lunes de un mes (0=enero)
function getNthMonday(year, month, n) {
	const date = new Date(year, month, 1);
	// Avanza al primer lunes
	while (date.getDay() !== 1) {
		date.setDate(date.getDate() + 1);
	}
	// Avanza al N-ésimo lunes
	date.setDate(date.getDate() + (n - 1) * 7);
	return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
