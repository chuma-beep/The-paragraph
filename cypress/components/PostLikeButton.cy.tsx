import React from "react";
import PostLikeButton from "@/components/PostLikeButton";

describe('Post Like Button Tests', () => {



  it('should display the like button', () => {
       cy.mount(<PostLikeButton postId={""}/>)
      cy.get('[data-testid="Like-Post"]').should('exist');
  });
});