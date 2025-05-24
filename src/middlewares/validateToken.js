import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  // Leer token desde header o cookies
  let token = null;

  // 1. Desde Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Si no está en header, buscar en cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3. Si no hay token en ningún lado, rechazar
  if (!token) return res.status(401).json({ message: "No token provided" });

  // 4. Verificar token
  jwt.verify(token, process.env.SECRET_KEY, (err, userDecoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = userDecoded;
    next();
  });
};
