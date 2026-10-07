import json

from litellm import acompletion


async def detect_freshness_requirement(message: str) -> bool:
    response = await acompletion(
        model="groq/openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": """
You are a freshness classifier for EchoMail.

Determine whether the user's request requires fresh information
from EchoMail's external data sources, such as Gmail or the
EchoMail database.

Return true when the answer depends on data that may have changed
since the conversation history was created.

Examples that require fresh data:
- Find a sent email
- Search for an email
- Did someone reply?
- Which emails are tracked?
- Which emails are pending?
- Which emails are overdue?
- What are my deadlines?
- Is this email completed?
- What is the current status of my emails?

Examples that do not require fresh data:
- What is EchoMail?
- What can you do?
- What does email tracking mean?
- Explain how EchoMail works
- General questions that do not require Gmail or database data

Important:
- Do not choose a tool.
- Do not retrieve data.
- Only determine whether fresh external data is required.
""",
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "freshness_classification",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "requires_fresh_data": {
                            "type": "boolean"
                        }
                    },
                    "required": ["requires_fresh_data"],
                    "additionalProperties": False,
                },
            },
        },
    )

    result = json.loads(response.choices[0].message.content)

    return result["requires_fresh_data"]
