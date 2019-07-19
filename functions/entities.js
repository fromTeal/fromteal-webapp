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
    "discuss": {
      from: ["suggested", "invited"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined"],
      to: "approved"
    },
    "decline": {
      from: ["invited", "discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: MEMBER_STATES,
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
    }
  }
  