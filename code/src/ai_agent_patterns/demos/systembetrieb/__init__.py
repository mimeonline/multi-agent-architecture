from __future__ import annotations

from collections import OrderedDict

from ai_agent_patterns.demos.common import DemoFn
from .actor_model import run as actor_model
from .adapter_pattern import run as adapter_pattern
from .audit_trail import run as audit_trail
from .capability_routing import run as capability_routing
from .checkpointing_resumability import run as checkpointing_resumability
from .compressed_context_memory import run as compressed_context_memory
from .conversational_memory import run as conversational_memory
from .distributed_tracing import run as distributed_tracing
from .episodic_memory import run as episodic_memory
from .event_driven_choreography import run as event_driven_choreography
from .function_calling import run as function_calling
from .graph_memory import run as graph_memory
from .human_in_the_loop_approval_gate import run as human_in_the_loop_approval_gate
from .integration_tests_for_agents import run as integration_tests_for_agents
from .least_privilege_agent import run as least_privilege_agent
from .llm_as_judge import run as llm_as_judge
from .mcp import run as mcp
from .multimodal_guardrails import run as multimodal_guardrails
from .output_validation_schema_enforcement import run as output_validation_schema_enforcement
from .permission_scoped_tools import run as permission_scoped_tools
from .pub_sub_agent_mesh import run as pub_sub_agent_mesh
from .saga_compensation import run as saga_compensation
from .sandbox_execution import run as sandbox_execution
from .semantic_memory import run as semantic_memory
from .token_cost_tracking import run as token_cost_tracking
from .tool_registry import run as tool_registry
from .vector_memory import run as vector_memory
from .workflow_dag_durable_execution import run as workflow_dag_durable_execution
from .working_memory import run as working_memory


def registry() -> dict[str, DemoFn]:
    demos: OrderedDict[str, DemoFn] = OrderedDict()
    demos["conversational-memory"] = conversational_memory
    demos["episodic-memory"] = episodic_memory
    demos["semantic-memory"] = semantic_memory
    demos["working-memory"] = working_memory
    demos["vector-memory"] = vector_memory
    demos["graph-memory"] = graph_memory
    demos["compressed-context-memory"] = compressed_context_memory
    demos["function-calling"] = function_calling
    demos["tool-registry"] = tool_registry
    demos["mcp"] = mcp
    demos["adapter-pattern"] = adapter_pattern
    demos["capability-routing"] = capability_routing
    demos["permission-scoped-tools"] = permission_scoped_tools
    demos["actor-model"] = actor_model
    demos["event-driven-choreography"] = event_driven_choreography
    demos["saga-compensation"] = saga_compensation
    demos["workflow-dag-durable-execution"] = workflow_dag_durable_execution
    demos["checkpointing-resumability"] = checkpointing_resumability
    demos["pub-sub-agent-mesh"] = pub_sub_agent_mesh
    demos["human-in-the-loop-approval-gate"] = human_in_the_loop_approval_gate
    demos["output-validation-schema-enforcement"] = output_validation_schema_enforcement
    demos["sandbox-execution"] = sandbox_execution
    demos["least-privilege-agent"] = least_privilege_agent
    demos["audit-trail"] = audit_trail
    demos["multimodal-guardrails"] = multimodal_guardrails
    demos["distributed-tracing"] = distributed_tracing
    demos["token-cost-tracking"] = token_cost_tracking
    demos["llm-as-judge"] = llm_as_judge
    demos["integration-tests-for-agents"] = integration_tests_for_agents
    return dict(demos)


__all__ = ["registry"]
