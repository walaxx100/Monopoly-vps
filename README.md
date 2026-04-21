# 🌍 Mr. Worldwide — Monopoly Game

Juego de Monopoly multijugador en tiempo real con el mapa Mr. Worldwide.

## 🚀 Deploy en tu VPS (Oracle Cloud Free Tier)

### 1. Copiar los archivos al VPS

cd /home/monopoly/
git pull origin main
docker compose up -d --build

### 2. Acceder al juego

http://132.226.102.215:3456/

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

# Ver logs
docker logs -f monopoly-worldwide

# Reiniciar
docker compose restart

# Detener
docker compose down




