const SINGLE_ATTRIBUTE_STATES = [
    "suggested",
    "discussed",
    "approved",
    "declined",
    "replaced",
    "DELETED"
  ]
  
  const SINGLE_ATTRIBUTE_TRANSITIONS = {
    "suggest": {
      from: [],
      to: "suggested"
    },
    "discuss": {
      from: ["suggested"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined", "replaced"],
      to: "approved"
    },
    "decline": {
      from: ["discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: SINGLE_ATTRIBUTE_STATES,
      to: "DELETED"
    }
  }
  
    
  const MULTIPLE_ATTRIBUTE_STATES = [
    "suggested",
    "discussed",
    "approved",
    "declined",
    "DELETED"
  ]
  
  const MULTIPLE_ATTRIBUTE_TRANSITIONS = {
    "suggest": {
      from: [],
      to: "suggested"
    },
    "discuss": {
      from: ["suggested"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined"],
      to: "approved"
    },
    "decline": {
      from: ["discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: MULTIPLE_ATTRIBUTE_STATES,
      to: "DELETED"
    }
  }
  

  const MEMBER_STATES = [
    "suggested",
    "added",
    "invited",
    "asked-to-join",
    "discussed",
    "approved",
    "declined",
    "DELETED"
  ]
  
  const MEMBER_TRANSITIONS = {
    "add": {
      from: [],
      to: "approved"
    },
    "suggest": {
      from: [],
      to: "suggested"
    },
    "invite": {
      from: [],
      to: "invited"
    },
    "join": {
      from: [],
      to: "asked-to-join"
    },
    "discuss": {
      from: ["suggested", "invited", "asked-to-join"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined"],
      to: "approved"
    },
    "decline": {
      from: ["asked-to-join", "invited", "discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: MEMBER_STATES,
      to: "DELETED"
    }
  }
  

  const TEAM_STATES = [
    "created",
    "DELETED"
  ]
  
  const TEAM_TRANSITIONS = {
    "create": {
      from: [],
      to: "created"
    },
    "delete": {
      from: TEAM_STATES,
      to: "DELETED"
    }
  }
  

  const MILESTONE_STATES = [
    "planned",
    "started",
    "completed",
    "due",
    "DELETED"
  ]
  
  const MILESTONE_TRANSITIONS = {
    "plan": {
      from: [],
      to: "planned"
    },
    "start": {
      from: ["planned"],
      to: "started"
    },
    "complete": {
      from: ["started", "planned"],
      to: "completed"
    },
    "miss": {
      from: ["started", "planned"],
      to: "due"
    },
    "delete": {
      from: MILESTONE_STATES,
      to: "DELETED"
    }
  }

  const WEB_PAGE_STATES = [
    "planned",
    "started",
    "reviewed",
    "published",
    "DELETED"
  ]
  
  const WEB_PAGE_TRANSITIONS = {
    "plan": {
      from: [],
      to: "planned"
    },
    "start": {
      from: ["planned"],
      to: "started"
    },
    "review": {
      from: ["started"],
      to: "reviewed"
    },
    "publish": {
      from: ["started", "reviewed"],
      to: "published"
    },
    "delete": {
      from: MILESTONE_STATES,
      to: "DELETED"
    }
  }

  exports.ENTITIES_METADATA = {
    //
    // purpose
    //
    purpose: {
      dataType: "string",
      maxCardinality: 1,
      teamAttribute: true,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // name
    //
    name: {
      dataType: "short_string",
      maxCardinality: 1,
      teamAttribute: true,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // description
    //
    description: {
      dataType: "string",
      maxCardinality: 1,
      teamAttribute: true,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // logo
    //
    logo: {
      dataType: "image_url",
      maxCardinality: 1,
      teamAttribute: true,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // intro
    //
    intro: {
      dataType: "video_url",
      maxCardinality: 1,
      teamAttribute: true,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // tag
    //
    tag: {
      dataType: "short_string",
      teamAttribute: true,
      states: MULTIPLE_ATTRIBUTE_STATES,
      transitions: MULTIPLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // tool
    //
    tool: {
      dataType: "tool",
      teamAttribute: false,
      states: MULTIPLE_ATTRIBUTE_STATES,
      transitions: MULTIPLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // member
    //
    member: {
      dataType: "person",
      teamAttribute: true,
      states: MEMBER_STATES,
      transitions: MEMBER_TRANSITIONS
    },
    //
    // team
    //
    // This actually isn't a "team-related-entity" such as the other entities
    // TODO extend the concept of entities to include not just team-related-entities
    //
    team: {
      dataType: "team",
      teamAttribute: false,
      states: TEAM_STATES,
      transitions: TEAM_TRANSITIONS
    },
    //
    // milestone
    //
    milestone: {
      dataType: "milestone",
      teamAttribute: true,
      states: MILESTONE_STATES,
      transitions: MILESTONE_TRANSITIONS
    },
    //
    // web_page
    //
    web_page: {
      dataType: "web_page",
      teamAttribute: false,
      states: WEB_PAGE_STATES,
      transitions: WEB_PAGE_TRANSITIONS
    }
  }
  