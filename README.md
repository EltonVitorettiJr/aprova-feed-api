# 📚 Documentação da API - Aprova Feed

Esta é a documentação oficial para integração do front-end com o back-end do Aprova Feed.

**URL Base Padrão:** `http://localhost:3000`
*(Nota: Lembrem-se de trocar `localhost` pelo IP da máquina na rede Wi-Fi local ao testar no Expo físico, ex: `http://192.168.1.15:3000`)*

---

## 🚀 Como Rodar o Projeto (Setup Inicial)

Para que a API funcione perfeitamente na sua máquina local, siga os passos abaixo. Você precisará ter o **Node.js** e o **Docker** instalados.

### 1. Variáveis de Ambiente

Antes de tudo, precisamos configurar as senhas e chaves secretas.
Na raiz do projeto, faça uma cópia do arquivo de exemplo das variáveis de ambiente:

1. Copie o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Abra o `.env` e certifique-se de que as portas e o `JWT_SECRET` estão preenchidos.

### 2. Subindo os Bancos de Dados (Docker)

Nossa API depende do **MongoDB** (para salvar os textos) e do **MinIO** (para salvar as imagens). Tudo isso está automatizado via Docker.
Abra o terminal na raiz do projeto e rode:

```bash
docker compose up -d

```

*(Nota: O parâmetro `-d` faz os containers rodarem em segundo plano. Para verificar se subiram corretamente, acesse `http://localhost:9001` no navegador para ver o painel do MinIO).*

### 3. Instalando as Dependências

Com os bancos de dados rodando, instale os pacotes do Node.js:

```bash
npm install

```

### 4. Ligando o Servidor

Agora é só dar a partida na API:

```bash
npm run dev

```

Se tudo der certo, você verá no terminal a mensagem de que o servidor está rodando e conectado ao banco de dados (normalmente em `http://localhost:3000`).

---

### 🔒 Autenticação (Bearer Token)

Com exceção da rota de login, **todas as rotas desta API são protegidas**.
O front-end deve capturar o `token` devolvido no Login e enviá-lo no cabeçalho (Header) de todas as requisições subsequentes no seguinte formato:

* **Key:** `Authorization`
* **Value:** `Bearer <seu_token_aqui>`

## 1. Autenticação (Auth)

### `POST /google-login`

Simula o login social. Cria um usuário novo ou retorna um existente.

* **Acesso:** Público (Não precisa de token)
* **Body (JSON):**
```json
{
  "email": "cliente@email.com", // Obrigatório
  "name": "Dra. Ana", // Obrigatório
  "avatar_url": "https://...", // Opcional
  "isAdmin": false // Opcional (Padrão: false)
}

```


* **Retorno de Sucesso (200 OK):**
```json
{
  "user": { "_id": "...", "email": "...", "name": "..." },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```



---

## 2. Usuários (User)

### `GET /user`

Lista todos os usuários cadastrados no banco.

* **Acesso:** Restrito (Apenas `isAdmin: true`)
* **Retorno de Sucesso (200 OK):** Retorna um Array de objetos contendo os dados dos clientes.

---

## 3. Feed e Postagens (Post)

### `GET /post`

Busca as postagens. O back-end já filtra automaticamente: Clientes só veem seus próprios posts. Admins veem tudo.

* **Acesso:** Cliente e Admin
* **Query Params (Filtros Opcionais na URL):**
* `?status=PENDING` (Filtra por status: PENDING, APPROVED ou ADJUSTMENT_NEEDED)
* `?clientId=123...` (Apenas Admin: filtra posts de uma cliente específica)


* **Retorno de Sucesso (200 OK):** Retorna um Array de posts ordenados pela data agendada.

### `POST /post`

Cria uma nova postagem no feed.

* **Acesso:** Restrito (Apenas Admin)
* **Body (JSON):**
```json
{
  "clientId": "6a10f...", // ID do usuário que receberá o post
  "video_script": "Texto do roteiro...",
  "image_urls": ["http://localhost:9000/aprovafeed-images/foto.png"], 
  "caption": "Texto da legenda",
  "scheduled_date": "2026-06-01T15:00:00.000Z"
}

```


*(Nota: `image_urls` deve ser preenchido com as URLs devolvidas pela rota `/upload`)*

### `PATCH /post/:postId`

Edita uma postagem existente.

* **Acesso:** Cliente e Admin. **Atenção:** O back-end bloqueia automaticamente. Se for Cliente, ele só aceita alterar os campos `status` e `feedback`.
* **Parâmetro de Rota:** `postId` (O ID do post)
* **Body (JSON):** Todos os campos do Post são opcionais nesta rota. Envie apenas o que deseja alterar.

### `DELETE /post/:postId`

Deleta uma postagem permanentemente.

* **Acesso:** Restrito (Apenas Admin)
* **Parâmetro de Rota:** `postId`

---

## 4. Arquivos e Imagens (Upload)

🚨 **Atenção Front-end (Two-Step Upload):** Para criar um post com imagens, primeiro envie os arquivos para `POST /upload`. Pegue o array de URLs que o back-end vai devolver e insira dentro do JSON do `POST /post` no campo `image_urls`.

### `POST /upload`

Faz o envio de imagens para o servidor MinIO. Suporta múltiplas imagens simultâneas.

* **Acesso:** Admin (e Cliente, dependendo da regra de negócio de anexos)
* **Formato de Envio:** `multipart/form-data` (Não é JSON!)
* **Campos do Formulário:**
* **Key:** `file` | **Type:** File (Anexe o arquivo de imagem gerado pelo `expo-image-picker`)


* **Retorno de Sucesso (201 Created):**
```json
{
  "urls": [
    "http://localhost:9000/aprovafeed-images/8472...png",
    "http://localhost:9000/aprovafeed-images/9183...jpeg"
  ]
}

```



### `DELETE /upload/:imageName`

Exclui uma imagem do servidor e remove a URL dela de todos os posts no banco de dados.

* **Acesso:** Restrito (Apenas Admin)
* **Parâmetro de Rota:** `imageName` (Deve ser o nome exato do arquivo com a extensão. Ex: `/upload/8472-uuid.png`)
