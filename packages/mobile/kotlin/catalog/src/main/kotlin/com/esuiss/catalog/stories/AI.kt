package com.esuiss.catalog.stories

import com.esuiss.catalog.StoryGroup
import com.esuiss.catalog.stories.ai.chainOfThoughtAIStories
import com.esuiss.catalog.stories.ai.chatAIStories
import com.esuiss.catalog.stories.ai.checkpointAIStories
import com.esuiss.catalog.stories.ai.confirmationAIStories
import com.esuiss.catalog.stories.ai.contextAIStories
import com.esuiss.catalog.stories.ai.fileTreeAIStories
import com.esuiss.catalog.stories.ai.inlineCitationAIStories
import com.esuiss.catalog.stories.ai.messageAIStories
import com.esuiss.catalog.stories.ai.modelSelectorAIStories
import com.esuiss.catalog.stories.ai.planAIStories
import com.esuiss.catalog.stories.ai.promptInputAIStories
import com.esuiss.catalog.stories.ai.queueAIStories
import com.esuiss.catalog.stories.ai.reasoningAIStories
import com.esuiss.catalog.stories.ai.sourcesAIStories
import com.esuiss.catalog.stories.ai.stackTraceAIStories
import com.esuiss.catalog.stories.ai.subagentAIStories
import com.esuiss.catalog.stories.ai.suggestionAIStories
import com.esuiss.catalog.stories.ai.taskAIStories
import com.esuiss.catalog.stories.ai.terminalAIStories
import com.esuiss.catalog.stories.ai.testResultsAIStories
import com.esuiss.catalog.stories.ai.toolAIStories

val aiStories: List<StoryGroup> = listOf(
    chainOfThoughtAIStories,
    chatAIStories,
    checkpointAIStories,
    confirmationAIStories,
    contextAIStories,
    fileTreeAIStories,
    inlineCitationAIStories,
    messageAIStories,
    modelSelectorAIStories,
    planAIStories,
    promptInputAIStories,
    queueAIStories,
    reasoningAIStories,
    sourcesAIStories,
    stackTraceAIStories,
    subagentAIStories,
    suggestionAIStories,
    taskAIStories,
    terminalAIStories,
    testResultsAIStories,
    toolAIStories,
)
