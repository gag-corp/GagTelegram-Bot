import axios from 'axios';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

async function getPublicIp() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw new Error('Erro ao obter o IP público: ' + error.message);
    }
}

async function iniciarLXC(vmId) {
    const proxmoxNode = process.env.PROXMOX_NODE;
    const apiKey = process.env.POXMOX_API_KEY;
    const proxmoxHost = process.env.PROXMOX_HOST;
    const url = `${proxmoxHost}/api2/json/nodes/${proxmoxNode}/lxc/${vmId}/status/start`;
    const config = {
        headers: {
            Authorization: `PVEAPIToken=${apiKey}`,
        },
        httpsAgent: agent,
    };

    try {
        const response = await axios.post(url, {}, config);
        if (response.status === 200 && response.data.data) {
            const ip = await getPublicIp();
            return `O servidor de Minecraft foi iniciado com sucesso! O ip do servidor é ${ip}:25565`;
        } else {
            return `Não foi possível iniciar o servidor de Minecraft.`;
        }
    } catch (error) {
        return `Erro ao iniciar o servidor: ${error.message}. Verifique o status do servidor com /minecraft e tente conectar, caso não consiga, reinicie o servidor com /reiniciarmine.`;
    }
}

async function reiniciarLXC(vmId) {
    const proxmoxNode = process.env.PROXMOX_NODE;
    const apiKey = process.env.PROXMOX_API_KEY;
    const proxmoxHost = process.env.PROXMOX_HOST;
    const url = `${proxmoxHost}/api2/json/nodes/${proxmoxNode}/lxc/${vmId}/status/reboot`;
    const config = {
        headers: {
            Authorization: `PVEAPIToken=${apiKey}`,
        },
        httpsAgent: agent,
    };

    try {
        const response = await axios.post(url, {}, config);
        if (response.status === 200 && response.data.data) {
            return `O servidor de Minecraft foi reinicializado com sucesso! Aguarde alguns minutos e tente conectar novamente.`;
        } else {
            return `Não foi possível reiniciar o servidor de Minecraft. Contate o Admin.`;
        }
    } catch (error) {
        return `Erro ao reiniciar o servidor: ${error.message}. Verifique o status do servidor com /minecraft`;
    }
}

async function verificarLXC(vmId) {
    const proxmoxNode = process.env.PROXMOX_NODE;
    const apiKey = process.env.PROXMOX_API_KEY;
    const proxmoxHost = process.env.PROXMOX_HOST;
    console.log(`${proxmoxHost} - ${proxmoxNode} - ${apiKey}`);
    const url = `${proxmoxHost}/api2/json/nodes/${proxmoxNode}/lxc/${vmId}/status/current`;
    const config = {
        headers: {
            Authorization: `PVEAPIToken=${apiKey}`,
        },
        httpsAgent: agent,
    };

    try {
        const response = await axios.get(url, config);
        if (response.status === 200 && response.data.data) {
            if (response.data.data.status === 'running') {
                const ip = await getPublicIp();
                return `O servidor de Minecraft está Online. O ip é: ${ip}:25565 `;
            } else {
                return `O servidor de Minecraft está Offline. Use o comando /iniciarmine para iniciar o servidor.`;
            }
        }
    } catch (error) {
        return `Erro ao verificar o servidor ${error.message}, Consulte o Admin`;
    }
}

export default {
    iniciarLXC,
    reiniciarLXC,
    verificarLXC,
};
