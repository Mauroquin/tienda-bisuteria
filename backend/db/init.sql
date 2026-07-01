-- Aura Artesanal — Database initialization

CREATE TABLE IF NOT EXISTS categorias (
    id             INT            NOT NULL AUTO_INCREMENT,
    nombre         VARCHAR(255)   NOT NULL,
    descripcion    TEXT           NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categoria_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
    id             INT            NOT NULL AUTO_INCREMENT,
    nombre         VARCHAR(255)   NOT NULL,
    descripcion    TEXT           NULL,
    precio         DECIMAL(10,2)  NOT NULL,
    stock          INT            NOT NULL DEFAULT 0,
    imagen_url     VARCHAR(500)   NULL,
    categoria_id   INT            NULL,
    activo         TINYINT(1)     NOT NULL DEFAULT 1,
    creado_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
    id             INT            NOT NULL AUTO_INCREMENT,
    nombre         VARCHAR(255)   NOT NULL,
    email          VARCHAR(255)   NOT NULL UNIQUE,
    password_hash  VARCHAR(255)   NOT NULL,
    rol            VARCHAR(50)    NOT NULL DEFAULT 'cliente',
    creado_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
    id               INT            NOT NULL AUTO_INCREMENT,
    usuario_id       INT            NOT NULL,
    nombre_completo  VARCHAR(255)   NOT NULL,
    cedula           VARCHAR(50)    NOT NULL,
    telefono         VARCHAR(50)    NOT NULL,
    correo           VARCHAR(255)   NOT NULL,
    direccion        VARCHAR(500)   NOT NULL,
    ciudad           VARCHAR(255)   NOT NULL,
    creado_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pedidos (
    id               INT            NOT NULL AUTO_INCREMENT,
    usuario_id       INT            NOT NULL,
    cliente_id       INT            NOT NULL,
    total            DECIMAL(10,2)  NOT NULL,
    estado           VARCHAR(50)    NOT NULL DEFAULT 'pendiente',
    direccion_envio  VARCHAR(500)   NULL,
    creado_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS detalle_pedido (
    id               INT            NOT NULL AUTO_INCREMENT,
    pedido_id        INT            NOT NULL,
    producto_id      INT            NOT NULL,
    cantidad         INT            NOT NULL,
    precio_unitario  DECIMAL(10,2)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pagos (
    id               INT            NOT NULL AUTO_INCREMENT,
    pedido_id        INT            NOT NULL,
    estado           VARCHAR(50)    NOT NULL DEFAULT 'pendiente',
    metodo           VARCHAR(100)   NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed categories (idempotente gracias a UNIQUE + IGNORE)
INSERT IGNORE INTO categorias (nombre, descripcion) VALUES
  ('PULSERAS', 'Pulseras artesanales'),
  ('ARETES', 'Aretes hechos a mano'),
  ('COLLARES', 'Collares artesanales'),
  ('CONJUNTOS', 'Conjuntos de bisutería');
