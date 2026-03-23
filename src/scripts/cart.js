// Módulo de carrito — centraliza la lógica de productos seleccionados
// Evita duplicar código entre Products.astro y OrderModal.astro

// Obtiene los productos seleccionados con cantidad > 0
export function getSelectedItems() {
	const cards = document.querySelectorAll('.product-card');
	const items = [];

	cards.forEach(card => {
		const qty = Number(card.querySelector('[data-qty]').textContent);
		if (qty > 0) {
			items.push({
				name: card.querySelector('.product-card__name').textContent,
				price: Number(card.dataset.price),
				qty,
				subtotal: qty * Number(card.dataset.price),
			});
		}
	});

	return items;
}

// Calcula el total de todos los productos seleccionados
export function calculateTotal() {
	return getSelectedItems().reduce((sum, item) => sum + item.subtotal, 0);
}

// Genera el HTML del resumen de productos
export function buildSummaryHTML() {
	const items = getSelectedItems();
	let html = '';

	items.forEach(item => {
		html += `<div class="summary-item"><span>${item.qty}x ${item.name}</span><span>$${item.subtotal} MXN</span></div>`;
	});

	html += `<div class="summary-total"><span>Total</span><span>$${calculateTotal()} MXN</span></div>`;
	return html;
}

// Verifica si hay al menos 1 producto seleccionado
export function hasSelectedItems() {
	const allQtys = document.querySelectorAll('[data-qty]');
	return Array.from(allQtys).some(el => Number(el.textContent) > 0);
}

// Resetea todos los contadores a 0
export function resetAllItems() {
	document.querySelectorAll('.product-card').forEach(card => {
		card.querySelector('[data-qty]').textContent = '0';
		card.querySelector('[data-total]').textContent = '';
	});
}

// Genera el mensaje de WhatsApp con los datos del pedido
export function buildWhatsAppMessage(name, phone, address, deliveryFormatted) {
	const items = getSelectedItems();
	let message = `*Nuevo Pedido - Suudai*\n\n`;
	message += `*Nombre:* ${name}\n`;
	message += `*Telefono:* ${phone}\n`;
	message += `*Direccion:* ${address}\n\n`;
	message += `*Productos:*\n`;

	items.forEach(item => {
		message += `- ${item.qty}x ${item.name} — $${item.subtotal} MXN\n`;
	});

	message += `\n*Total: $${calculateTotal()} MXN*\n`;
	message += `*Entrega estimada:* ${deliveryFormatted}\n`;
	message += `*Pago:* Cobro a la entrega`;

	return message;
}
