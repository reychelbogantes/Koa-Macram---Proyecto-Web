import { create, router as _router, defaults } from 'json-server';

const server = create();
const router = _router('db.json');
const middlewares = defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server corriendo en puerto ${PORT}`);
});