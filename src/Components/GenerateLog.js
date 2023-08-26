import React from "react";
import { supabase } from "../supabase-client";

async function GenerateLog(action, target, userID) {
    // generate log
    let { data, error } = await supabase
        .from("activity_log")
        .insert([
            {
                managed_by: userID,
                action: action,
                target: target,
            },
        ])
        .select("*");

    if (error) {
        console.log("error", error);
    }

}

export default GenerateLog;