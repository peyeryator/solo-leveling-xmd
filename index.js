
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (text === '!menu') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Welcome to Solo Leveling XMD Bot!\nCommands: !menu, !level' });
        } else if (text === '!level') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'You are now Level 1 Hunter!' });
        }
    });
}

startBot();
