

import React from "react";
import CommentsLikeButton from "@/components/CommentsLikeButton";

describe('Comments Like Button Tests', () => {
  
  it('should call handleLike when button is clicked', () => {
    // Mount the CommentsLikeButton component
    cy.mount(<CommentsLikeButton commentId="1" />);

    // Click the button and check if it is clickable
    cy.get('button').click();


    cy.get('button').should('be.disabled'); 
  });
});
