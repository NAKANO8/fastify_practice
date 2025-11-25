import { buildApp } from "../src/server.js";
import { describe, test, expect, beforeEach } from "vitest";

// 毎回新しいアプリを作る
let app;
beforeEach(() => {
  app = buildApp();
});

describe("Users API", () => {
  test("GET /users returns 200", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/users",
    });

    expect(res.statusCode).toBe(200);
  });

  test("POST /users creates a new user", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "testuser",
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.username).toBe("testuser");
  });

  test("GET /users/:id returns a single user", async () => {
    // まずユーザーを作成
    const created = await app.inject({
      method: "POST",
      url: "/users",
      payload: { username: "hika" },
    });
    const user = created.json();

    // 次に取得
    const res = await app.inject({
      method: "GET",
      url: `/users/${user.id}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().id).toBe(user.id);
  });

  test("PUT /users/:id updates a user", async () => {
    // 作成
    const created = await app.inject({
      method: "POST",
      url: "/users",
      payload: { username: "oldname" },
    });
    const user = created.json();

    // 更新
    const res = await app.inject({
      method: "PUT",
      url: `/users/${user.id}`,
      payload: { username: "newname" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().username).toBe("newname");
  });

  test("DELETE /users/:id deletes a user", async () => {
    // 作成
    const created = await app.inject({
      method: "POST",
      url: "/users",
      payload: { username: "delete-me" },
    });
    const user = created.json();

    // 削除
    const res = await app.inject({
      method: "DELETE",
      url: `/users/${user.id}`,
    });

    expect(res.statusCode).toBe(200);

    // 削除後に再取得 → null のはず
    const check = await app.inject({
      method: "GET",
      url: `/users/${user.id}`,
    });

    expect(check.json()).toBeNull();
  });
});

