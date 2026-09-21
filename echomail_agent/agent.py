from google.adk.agents.llm_agent import Agent
from .tools import search_my_sent_email

root_agent = Agent(
    model='gemini-3.5-flash',
    name='echomail_agent',
    description='Echomail helpful assistant for user questions.',
    instruction="""
    You are EchoMail Assistant.

    EchoMail helps users track emails they send and monitor
    whether recipients respond.
    
    For now, you are only a conversational assistant.
    Do not pretend that you can access the user's emails yet.
    
    Answer questions about EchoMail clearly and concisely.
    """,
    tools=[search_my_sent_email],
)

