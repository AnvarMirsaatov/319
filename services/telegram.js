const { Telegraf, Markup } = require('telegraf');
const db = require('../db/database');

let bot = null;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

/**
 * Telegraf botini initsializatsiya qilish va callback tugmalarni sozlash
 */
function initBot() {
  if (!botToken || botToken === 'your_telegram_bot_token_here' || botToken === 'dummy_token_for_dev') {
    console.log('ℹ️ Telegram bot token sozlanmagan yoki dev rejimida.');
    return;
  }

  try {
    bot = new Telegraf(botToken);

    // /start buyrug'i
    bot.start((ctx) => {
      ctx.reply(`Salom! Bu Tezkor yetkazib berish xizmati admin boti.\nSizning Chat ID: <code>${ctx.chat.id}</code>`, {
        parse_mode: 'HTML'
      });
    });

    // "Qabul qilindi" inline tugmasi bosilganda
    bot.action(/order:accept:(.+)/, async (ctx) => {
      const orderId = ctx.match[1];
      try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) {
          return ctx.answerCbQuery('Buyurtma topilmadi!');
        }

        db.prepare("UPDATE orders SET status = 'accepted' WHERE id = ?").run(orderId);
        await ctx.answerCbQuery('Buyurtma qabul qilindi! ✅');

        // Xabardagi tugmalarni yangilash ("Yetkazildi" tugmasi qoladi)
        const updatedKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🚀 Yetkazildi', `order:deliver:${orderId}`)]
        ]);

        const originalText = ctx.callbackQuery.message.text || '';
        const statusNotice = '\n\n📌 <b>Holat: QABUL QILINDI ✅</b>';

        if (!originalText.includes('QABUL QILINDI')) {
          await ctx.editMessageText(originalText + statusNotice, {
            reply_markup: updatedKeyboard.reply_markup,
            parse_mode: 'HTML'
          }).catch(() => {});
        }
      } catch (err) {
        console.error('Error handling order:accept action:', err.message);
        ctx.answerCbQuery('Xatolik yuz berdi').catch(() => {});
      }
    });

    // "Yetkazildi" inline tugmasi bosilganda
    bot.action(/order:deliver:(.+)/, async (ctx) => {
      const orderId = ctx.match[1];
      try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) {
          return ctx.answerCbQuery('Buyurtma topilmadi!');
        }

        db.prepare("UPDATE orders SET status = 'completed' WHERE id = ?").run(orderId);
        await ctx.answerCbQuery('Buyurtma muvaffaqiyatli yetkazildi! 🎉');

        const originalText = ctx.callbackQuery.message.text || '';
        const statusNotice = '\n\n🎉 <b>Holat: YETKAZILDI (YAKUNLANDI) 🏁</b>';

        await ctx.editMessageText(originalText + statusNotice, {
          parse_mode: 'HTML'
        }).catch(() => {});
      } catch (err) {
        console.error('Error handling order:deliver action:', err.message);
        ctx.answerCbQuery('Xatolik yuz berdi').catch(() => {});
      }
    });

    // Bot pollingni ishga tushirish (xatolik serverni to'xtatmasligi uchun)
    bot.launch().then(() => {
      console.log('🤖 Telegram Bot muvaffaqiyatli ishga tushdi (Polling faol)');
    }).catch((err) => {
      console.warn('⚠️ Telegram Bot ulanishida xatolik (token tekshirilsin):', err.message);
    });

    // Graceful stop
    process.once('SIGINT', () => bot && bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot && bot.stop('SIGTERM'));
  } catch (err) {
    console.warn('⚠️ Telegraf initsializatsiya xatosi:', err.message);
  }
}

// Format date helper: YYYY-MM-DD HH:mm
function formatDate(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Format va yuborish: TZ-ning 5-bo'limidagi qat'iy format bo'yicha
 */
function buildOrderMessage(orderData) {
  const items = typeof orderData.items_json === 'string'
    ? JSON.parse(orderData.items_json)
    : (orderData.items || []);

  const itemsFormatted = items.map((it, idx) => {
    const qty = it.quantity || 1;
    const price = Number(it.price).toLocaleString();
    const subtotal = Number(it.total || (it.price * qty)).toLocaleString();
    return `${idx + 1}. ${it.title} - ${qty} x ${price} = ${subtotal} so'm`;
  }).join('\n');

  const deliveryText = orderData.delivery_fee === 0
    ? "BEPUL (250,000 so'mdan yuqori)"
    : `${Number(orderData.delivery_fee).toLocaleString()} so'm`;

  const discountAmount = Number(orderData.discount || 0).toLocaleString();
  const qualifyingCount = orderData.qualifying_orders_count !== undefined 
    ? orderData.qualifying_orders_count 
    : (orderData.orders_count_350k_plus || 0);

  const grandTotal = Number(orderData.total_amount).toLocaleString();
  const productsTotal = Number(orderData.total_products).toLocaleString();
  const paymentTypeMap = {
    cash: 'NAQD PUL',
    payme_click: 'PAYME / CLICK',
    card_on_delivery: 'ESHIK TAGIDA KARTA ORQALI',
    payme: 'PAYME',
    click: 'CLICK'
  };
  const paymentTypeUpper = paymentTypeMap[orderData.payment_type] || (orderData.payment_type || 'cash').toUpperCase();

  const landmarkText = orderData.landmark || '—';
  const locationUrl = (orderData.lng && orderData.lat)
    ? `https://yandex.uz/maps/?pt=${orderData.lng},${orderData.lat}&z=16&l=map`
    : '—';

  return `YANGI BUYURTMA: #${orderData.id}
Buyurtma vaqti: ${formatDate(orderData.created_at)}
Yetkazish muddati: ${formatDate(orderData.deadline_at)} (Maksimal 1 soat!)
Mijoz ma'lumotlari:
• Ism: ${orderData.customer_name}
• Tel: ${orderData.customer_phone}
• Manzil: ${orderData.address}
• Mo'ljal: ${landmarkText}
Lokatsiya: ${locationUrl}

Mahsulotlar:
${itemsFormatted}

Hisob-kitob:
• Mahsulotlar summasi: ${productsTotal} so'm
• Yetkazib berish: ${deliveryText}
• Chegirma: ${discountAmount} so'm (Sodiqlik: ${qualifyingCount}/7 ta 350k+ buyurtma mavjud)
JAMI TO'LOV: ${grandTotal} so'm
To'lov turi: ${paymentTypeUpper}`;
}

/**
 * Yangi buyurtma haqida Telegram do'kon adminiga xabarnoma yuborish
 * Inline tugmalar bilan: "Qabul qilindi", "Yetkazildi"
 */
async function sendOrderNotification(orderData) {
  if (!bot || !chatId || chatId === 'your_telegram_chat_id_here' || chatId === 'dummy_chat_id_for_dev') {
    return { sent: false, reason: 'Telegram bot yoki Chat ID sozlanmagan' };
  }

  const messageText = buildOrderMessage(orderData);

  const inlineKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Qabul qilindi', `order:accept:${orderData.id}`),
      Markup.button.callback('🚀 Yetkazildi', `order:deliver:${orderData.id}`)
    ]
  ]);

  try {
    const sentMessage = await bot.telegram.sendMessage(chatId, messageText, {
      ...inlineKeyboard,
      disable_web_page_preview: false
    });
    return { sent: true, messageId: sentMessage.message_id };
  } catch (error) {
    console.error('Telegramga buyurtma xabarnomasini yuborishda xatolik:', error.message);
    return { sent: false, error: error.message };
  }
}

// Botni initsializatsiya qilish
initBot();

module.exports = {
  bot,
  initBot,
  buildOrderMessage,
  sendOrderNotification
};
