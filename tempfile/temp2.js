import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, Space } from "antd";
import { Button, Checkbox, Form, Input } from "antd";

// supabase keys
const supabaseUrl = "https://exsvuquqspmbrtyjdpyc.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo";

const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
    const [session, setSession] = useState(null);

    const logout = () => {
        supabase.auth.signOut();
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log(session);
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(_event);
            if (_event === "PASSWORD_RECOVERY") {
                window.location.href = "/reset-password";
            }
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return (
            <div
                style={{
                    backgroundColor: "#f0f2f5",
                    height: "100vh",
                    width: "100vw",
                    margin: "0",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Space direction="vertical" size={16}>
                    <Card title="Login" style={{ width: "50vw", textAlign:'center' }}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your username!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                            </Form.Item>
                        </Form>
                        <Button type="primary" block>
                            Login
                        </Button>
                    </Card>
                </Space>
            </div>
        );
    }
    // login success
    else {
        return (
            <div>
                <Button danger type="primary" onClick={logout}>
                    logout
                </Button>
                Logged in!
            </div>
        );
    }
}
