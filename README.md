# 🌍 Mr. Worldwide — Monopoly Game

Juego de Monopoly multijugador en tiempo real con el mapa Mr. Worldwide.

## 🚀 Deploy en tu VPS (Oracle Cloud Free Tier)

### 1. Copiar los archivos a tu VPS

```bash
# En tu máquina local, comprimir el proyecto
zip -r monopoly-worldwide.zip monopoly-worldwide/

# Copiar al VPS
scp monopoly-worldwide.zip ubuntu@TU_IP_VPS:~/
```

### 2. En el VPS

```bash
# Descomprimir
unzip monopoly-worldwide.zip
cd monopoly-worldwide

# Levantar con Docker (no afecta tus otros contenedores)
docker compose up -d --build

# Verificar que está corriendo
docker ps | grep monopoly
docker logs monopoly-worldwide
```

### 3. Abrir el puerto en Oracle Cloud

En Oracle Cloud Console → Networking → VCN → Security Lists:
- Agregar **Ingress Rule**: TCP puerto **3456** (o el que prefieras)

También en el VPS:
```bash
sudo iptables -I INPUT -p tcp --dport 3456 -j ACCEPT
# Para que persista:
sudo netfilter-persistent save
```

### 4. Acceder al juego

- **Directo**: `http://TU_IP_VPS:3456`
- **Con nginx** (si tienes dominio): agrega el snippet de `nginx-snippet.conf` a tu config

### Usar con nginx existente (sin afectar WordPress)

Edita tu nginx config y agrega el bloque de `nginx-snippet.conf`:

```bash
# Editar config existente
sudo nano /etc/nginx/sites-available/default
# Pegar el contenido de nginx-snippet.conf dentro del server block existente
sudo nginx -t && sudo nginx -s reload
```

Luego accede en: `http://tudominio.com/monopoly/`

---

## 🎮 Cómo jugar

1. El primer jugador crea una sala y comparte el **código de 6 letras**
2. Los demás entran el código en "Join Room"
3. El host presiona **Start Game**
4. Turnos: tirar dados → comprar/pagar → construir casas

## ⚙️ Configuraciones disponibles

- ×2 renta en set completo
- Caja de vacaciones (acumula impuestos)
- Subastas cuando no se compra
- Sin renta cuando el dueño está en prisión
- Hipotecas
- Construcción pareja (even build)
- Orden aleatorio de jugadores
- Capital inicial: $1000 / $1500 / $2000 / $3000

## 🔧 Comandos útiles

```bash
# Ver logs
docker logs -f monopoly-worldwide

# Reiniciar
docker compose restart

# Detener
docker compose down

# Actualizar (si cambias archivos)
docker compose up -d --build
```
