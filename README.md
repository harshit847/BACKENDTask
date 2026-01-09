# Event & Nudge API Documentation

## Base URL
/api/v3/app

## Event APIs
Includes CRUD operations for managing events.
Tested using Postman.

## Nudge APIs (Task 2 – MAIN PART)

## BASE URL -  /api/v3/app

## OBJECT DATA MODEL 
type: "nudge"
uid: Number (User ID who created the nudge)
event_id: ObjectId (Associated Event ID)
title: String
description: String
send_time: Timestamp (Date + Time)
image: File (cover image for the nudge)
icon: String (icon name or URL)
invitation_text: String (one-line invite message)
status: String (scheduled | sent)
created_at: Timestamp

## Nudge API Endpoints (CRUD)

- Create Nudge
Field	Value
Method	POST
Endpoint	/nudges
Payload	title, event_id, image, send_time, description, icon, invitation_text
Description	Creates a new nudge for a specific event
- Sample Payload
{
  "title": "Event Reminder",
  "event_id": "69602f1e3c8e1d1514046a6a",
  "send_time": "2026-01-10T10:00:00Z",
  "description": "Reminder for the upcoming event",
  "icon": "bell",
  "invitation_text": "Join us today!"
}

- Success Response
{
  "id": "69701f2e3c8e1d1514047b9c"
}

- Get Nudge by ID
Field	Value
Method	GET
Endpoint	/nudges/:id
Description	Fetches a nudge using its unique _id
- Get Nudges by Event
Field	Value
Method	GET
Endpoint	/nudges?event_id=:event_id
Description	Retrieves all nudges related to a specific event
- Update Nudge
Field	Value
Method	PUT
Endpoint	/nudges/:id
Payload	Same as Create Nudge
Description	Updates an existing nudge
- Delete Nudge
Field	Value
Method	DELETE
Endpoint	/nudges/:id
Description	Deletes a nudge by its unique _id
⚠️ Error Responses (Common)
{
  "error": "Nudge not found"
}

{
  "error": "Invalid request data"
}

## Notes
- MongoDB native driver used (no mongoose)
- No fixed schema followed as per requirements
- APIs tested locally using Postman
- Database connection may be temporarily disabled due to local SSL issues
