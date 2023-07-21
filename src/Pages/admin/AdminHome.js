import React from 'react'
import { supabase } from "../../supabase-client";
import { Button } from 'antd';

function AdminHome() {
    return (
        <div>
            <h1>Admin Home</h1>
            <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
        </div>
    )
}

export default AdminHome;