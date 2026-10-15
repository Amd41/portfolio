---
title: "SOLIDWORKS AI Agent \u2014 cylinder and bushing MVP"
date: 2026-10-15
status: review
---

# Building an AI-Powered CAD Agent for SOLIDWORKS 2025

## Project Overview

I'm developing a local AI-powered CAD automation system that translates natural-language engineering instructions into 3D mechanical models using Python, Ollama, and the SOLIDWORKS API.

The objective is to simplify repetitive CAD modeling tasks while maintaining parametric design capabilities and engineering precision.

## The Engineering Challenge

Traditional CAD modeling requires users to manually define sketches, dimensions, and features.

This project explores whether natural-language instructions can be translated into reliable, executable CAD operations.

## Current Implementation

The first working version supports:

- Creating cylindrical components with specified dimensions.
- Generating cylindrical bushings with through-holes.
- Saving generated models in SOLIDWORKS part format (`.SLDPRT`).

These operations have been successfully tested locally.

## Technology Stack

- **CAD Software:** SOLIDWORKS 2025
- **Programming Language:** Python
- **AI Engine:** Ollama
- **Integration:** SOLIDWORKS API
- **Architecture:** Local AI-assisted CAD automation

## Development Roadmap

The next development phase will focus on:

1. Extruded Cut
2. Revolve
3. Fillet
4. Chamfer
5. Reliable multi-feature modeling
6. Improved error handling and geometric validation

These advanced features are planned and have not yet been verified.

## Engineering Perspective

AI can help interpret design requirements, but a reliable CAD automation system must validate dimensions, feature creation, and saved model geometry.

My development approach is to implement and verify each CAD operation before expanding the system.

## Project Status

**Status:** Active development — basic cylindrical modeling implemented and tested locally.

Further updates will document newly verified capabilities and engineering challenges.
