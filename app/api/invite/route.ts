import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, name, role } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the origin for redirect URL
    const origin = request.headers.get("origin") || "https://parentys.com"

    // Send invitation email
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: name || "",
        role: role || "expert",
        invited: true,
      },
      redirectTo: `${origin}/bo/login`,
    })

    if (error) {
      console.error("Invite error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Invitation sent to ${email}`,
      userId: data.user?.id 
    })
  } catch (error) {
    console.error("Invite API error:", error)
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}
