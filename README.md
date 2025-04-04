# Backend 2 - Entrega Final

Proyecto de servidor e-commerce realizado como entrega final del curso **Backend 2** en CoderHouse.

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- MongoDB con Mongoose
- JWT para autenticación
- Passport.js
- Handlebars
- DAO, DTO y patrón Repository

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git

2. Instalar dependencias:
npm install

3. Crear un archivo .env en la raíz del proyecto basado en .env.example:
PORT=5000
MONGO_URI=mongodb+srv://tu_usuario:tu_pass@cluster.mongodb.net/backend2
JWT_SECRET=unaClaveSecreta

4. Iniciar el servidor:
npm run dev

🚀 Funcionalidades
Registro y login de usuarios con JWT

Roles user y admin

CRUD de productos (solo admin)

Carrito de compras

Finalización de compra y generación de tickets

Rutas protegidas y autorizaciones por rol

🧪 Rutas útiles
POST /api/auth/login → Login con JWT

GET /api/auth/current → Ver usuario logueado

GET /api/products → Ver productos

POST /api/carts/:cid/product/:pid → Agregar producto a carrito

POST /api/carts/:cid/purchase → Finalizar compra

GET /api/tickets → Ver tickets (solo admin)
